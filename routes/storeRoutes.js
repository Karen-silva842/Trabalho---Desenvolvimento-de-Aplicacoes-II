const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

let storesDB = loadStores()

function loadStores() {
  try {
    return JSON.parse(fs.readFileSync('./src/data/store.json', 'utf8'))
  } catch (err) {
    return []
  }
}

function saveStores() {
  try {
    fs.writeFileSync('./src/data/store.json', JSON.stringify(storesDB, null, 2))
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
 *     summary: Retorna todas as lojas cadastradas
 *     tags: [Lojas]
 *     responses:
 *       200:
 *         description: Lista de todas as lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get('/', (req, res) => {
  storesDB = loadStores()
  res.json(storesDB)
})

/**
 * @swagger
 * /store/{id}:
 *   get:
 *     summary: Retorna uma loja específica pelo ID
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da loja
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loja encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
router.get('/:id', (req, res) => {
  const id = req.params.id
  storesDB = loadStores()
  const store = storesDB.find(s => s.id === id)
  if (!store) return res.status(404).json({ erro: 'Loja não encontrada!' })
  res.json(store)
})

/**
 * @swagger
 * /store:
 *   post:
 *     summary: Cria uma nova loja
 *     tags: [Lojas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 */
router.post('/', (req, res) => {
  const { store_name, cnpj, address, phone_number, contact_email, status } = req.body
  if (!store_name || !cnpj || !address || !phone_number || !contact_email || !status) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' })
  }

  const newStore = { id: uuidv4(), store_name, cnpj, address, phone_number, contact_email, status }
  storesDB = loadStores()
  storesDB.push(newStore)
  saveStores()
  res.status(201).json(newStore)
})

/**
 * @swagger
 * /store/{id}:
 *   put:
 *     summary: Atualiza uma loja existente
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da loja
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
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

/**
 * @swagger
 * /store/{id}:
 *   delete:
 *     summary: Remove uma loja pelo ID
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da loja
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loja removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
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
