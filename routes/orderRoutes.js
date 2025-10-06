const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

var ordersDB = loadOrders()

function loadOrders() {
  try {
    return JSON.parse(fs.readFileSync('./data/order.json', 'utf8'))
  } catch (err) {
    return []
  }
}

function saveOrders() {
  try {
    fs.writeFileSync('./data/order.json', JSON.stringify(ordersDB, null, 2))
    return 'Saved'
  } catch (err) {
    return 'Not saved'
  }
}

router.get('/', (req, res) => {
  console.log("GET /orders")
  ordersDB = loadOrders()
  res.json(ordersDB)
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  ordersDB = loadOrders()
  const order = ordersDB.find(order => order.id === id)
  if (!order) {
    return res.status(404).json({ "erro": "Pedido não encontrado!" })
  }
  res.json(order)
})

router.post('/', (req, res) => {
  const newOrder = {
    id: uuidv4(),
    ...req.body
  }
  console.log(newOrder)
  ordersDB = loadOrders()
  ordersDB.push(newOrder)
  let result = saveOrders()
  console.log(result)
  return res.status(201).json(newOrder)
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const newOrderData = req.body
  ordersDB = loadOrders()
  const currentOrder = ordersDB.find(order => order.id === id)
  const currentIndex = ordersDB.findIndex(order => order.id === id)

  if (!currentOrder) {
    return res.status(404).json({ "erro": "Pedido não encontrado!" })
  }

  ordersDB[currentIndex] = { ...currentOrder, ...newOrderData }
  let result = saveOrders()
  console.log(result)
  return res.json(ordersDB[currentIndex])
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  ordersDB = loadOrders()
  const currentOrder = ordersDB.find(order => order.id === id)
  const currentIndex = ordersDB.findIndex(order => order.id === id)

  if (!currentOrder) {
    return res.status(404).json({ "erro": "Pedido não encontrado!" })
  }

  const deleted = ordersDB.splice(currentIndex, 1)
  let result = saveOrders()
  console.log(result)
  res.json(deleted)
})

module.exports = router
