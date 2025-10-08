const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

let storesDB = loadStores()

function loadStores() {
  try {
    return JSON.parse(fs.readFileSync('./data/store.json', 'utf8'))
  } catch (err) {
    return []
  }
}

function saveStores() {
  try {
    fs.writeFileSync('./data/store.json', JSON.stringify(storesDB, null, 2))
    return 'Salvo'
  } catch (err) {
    console.error('Erro ao salvar lojas:', err)
    return 'Não salvo'
  }
}

/**
 * @swagger
 * tags:
 *   - name: Lojas
 *     description: Rotas de gerenciamento de lojas - Bryan Gonçalves Pereira
 *
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         store_name:
 *           type: string
 *         cnpj:
 *           type: string
 *         address:
 *           type: string
 *         phone_number:
 *           type: string
 *         contact_email:
 *           type: string
 *         status:
 *           type: string
 *         date:
 *           type: string
 *           description: "Data de criação da loja (YYYY-MM-DD)"
 *       required:
 *         - id
 *         - store_name
 *         - cnpj
 *         - address
 *         - phone_number
 *         - contact_email
 *         - status
 */

/**
 * @swagger
 * /store:
 *   get:
 *     summary: Retorna todas as lojas ou busca por id, store_name ou date
 *     tags: [Lojas]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: "ID da loja"
 *       - in: query
 *         name: store_name
 *         schema:
 *           type: string
 *         description: "Nome da loja"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: "Data de criação da loja (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: Loja(s) encontrada(s)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Store'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
router.get('/', (req, res) => {
  storesDB = loadStores()
  const { id, store_name, date } = req.query

  let results = storesDB

  if (id) results = results.filter(s => s.id === id)
  if (store_name) results = results.filter(s => s.store_name.toLowerCase().includes(store_name.toLowerCase()))
  if (date) results = results.filter(s => s.date && s.date.includes(date))

  if (results.length === 0) return res.status(404).json({ erro: 'Loja não encontrada!' })

  res.json(results.length === 1 ? results[0] : results)
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  storesDB = loadStores()
  const store = storesDB.find(s => s.id === id)
  if (!store) return res.status(404).json({ erro: 'Loja não encontrada!' })
  res.json(store)
})

router.post('/', (req, res) => {
  const { store_name, cnpj, address, phone_number, contact_email, status } = req.body
  if (!store_name || !cnpj || !address || !phone_number || !contact_email || !status) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' })
  }

  storesDB = loadStores()
  const newStore = { id: uuidv4(), store_name, cnpj, address, phone_number, contact_email, status }
  storesDB.push(newStore)
  saveStores()
  res.status(201).json(newStore)
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { store_name, cnpj, address, phone_number, contact_email, status } = req.body
  storesDB = loadStores()
  const index = storesDB.findIndex(s => s.id === id)
  if (index === -1) return res.status(404).json({ erro: 'Loja não encontrada!' })

  storesDB[index] = { id, store_name, cnpj, address, phone_number, contact_email, status }
  saveStores()
  res.json(storesDB[index])
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  storesDB = loadStores()
  const index = storesDB.findIndex(s => s.id === id)
  if (index === -1) return res.status(404).json({ erro: 'Loja não encontrada!' })

  const deleted = storesDB.splice(index, 1)
  saveStores()
  res.json(deleted[0])
})

module.exports = router
