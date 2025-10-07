const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

let ordersDB = loadOrders()

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

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Rotas relacionadas a pedidos
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 */
router.get('/', (req, res) => {
  ordersDB = loadOrders()
  res.json(ordersDB)
})

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', (req, res) => {
  const id = req.params.id
  ordersDB = loadOrders()
  const order = ordersDB.find(o => o.id === id)
  if (!order) return res.status(404).json({ erro: "Pedido não encontrado!" })
  res.json(order)
})

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cadastra um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto:
 *                       type: string
 *                     quantidade:
 *                       type: number
 *                     valorTotal:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
router.post('/', (req, res) => {
  const newOrder = { id: uuidv4(), ...req.body }
  ordersDB = loadOrders()
  ordersDB.push(newOrder)
  saveOrders()
  res.status(201).json(newOrder)
})

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', (req, res) => {
  const id = req.params.id
  const newOrderData = req.body
  ordersDB = loadOrders()
  const index = ordersDB.findIndex(o => o.id === id)
  if (index === -1) return res.status(404).json({ erro: "Pedido não encontrado!" })
  ordersDB[index] = { ...ordersDB[index], ...newOrderData }
  saveOrders()
  res.json(ordersDB[index])
})

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Remove um pedido pelo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id
  ordersDB = loadOrders()
  const index = ordersDB.findIndex(o => o.id === id)
  if (index === -1) return res.status(404).json({ erro: "Pedido não encontrado!" })
  const deleted = ordersDB.splice(index, 1)
  saveOrders()
  res.json(deleted[0])
})

module.exports = router
