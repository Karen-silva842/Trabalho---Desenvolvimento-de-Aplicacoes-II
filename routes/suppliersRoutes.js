const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

let suppliersDB = loadSuppliers()

function loadSuppliers() {
  try {
    return JSON.parse(fs.readFileSync('./data/suppliers.json', 'utf8'))
  } catch (err) {
    return []
  }
}

function saveSuppliers() {
  try {
    fs.writeFileSync('./data/suppliers.json', JSON.stringify(suppliersDB, null, 2))
    return 'Salvo'
  } catch (err) {
    console.error('Erro ao salvar fornecedores:', err)
    return 'Não salvo'
  }
}

/**
 * @swagger
 * tags:
 *   - name: Fornecedores
 *     description: Rotas de gerenciamento de fornecedores - Karen Suélen da Silva
 *
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         supplier_name:
 *           type: string
 *         supplier_category:
 *           type: string
 *         contact_email:
 *           type: string
 *         phone_number:
 *           type: string
 *         status:
 *           type: string
 *         date:
 *           type: string
 *           description: "Data de criação do fornecedor (YYYY-MM-DD)"
 */

/**
 * @swagger
 * /supplier:
 *   get:
 *     summary: Retorna todos os fornecedores ou busca por id, supplier_name ou date
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: "ID do fornecedor"
 *       - in: query
 *         name: supplier_name
 *         schema:
 *           type: string
 *         description: "Nome do fornecedor"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: "Data de criação do fornecedor (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: Fornecedor(es) encontrado(s)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Supplier'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 */
router.get('/', (req, res) => {
  suppliersDB = loadSuppliers()
  const { id, supplier_name, date } = req.query

  let results = suppliersDB

  if (id) results = results.filter(s => s.id === id)
  if (supplier_name) results = results.filter(s => s.supplier_name.toLowerCase().includes(supplier_name.toLowerCase()))
  if (date) results = results.filter(s => s.date && s.date.includes(date))

  if (results.length === 0) return res.status(404).json({ erro: 'Fornecedor não encontrado!' })

  res.json(results.length === 1 ? results[0] : results)
})

/**
 * @swagger
 * /supplier/{id}:
 *   get:
 *     summary: Retorna um fornecedor específico pelo ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do fornecedor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 */
router.get('/:id', (req, res) => {
  const id = req.params.id
  suppliersDB = loadSuppliers()
  const supplier = suppliersDB.find(s => s.id === id)
  if (!supplier) return res.status(404).json({ erro: 'Fornecedor não encontrado!' })
  res.json(supplier)
})

/**
 * @swagger
 * /supplier:
 *   post:
 *     summary: Cadastra um novo fornecedor
 *     tags: [Fornecedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplier_name
 *               - supplier_category
 *               - contact_email
 *               - phone_number
 *             properties:
 *               supplier_name:
 *                 type: string
 *               supplier_category:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fornecedor cadastrado com sucesso
 */
router.post('/', (req, res) => {
  const { supplier_name, supplier_category, contact_email, phone_number, status } = req.body
  if (!supplier_name || !supplier_category || !contact_email || !phone_number) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' })
  }

  suppliersDB = loadSuppliers()
  const newSupplier = { id: uuidv4(), supplier_name, supplier_category, contact_email, phone_number, status: status || 'on' }
  suppliersDB.push(newSupplier)
  saveSuppliers()
  res.status(201).json(newSupplier)
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  suppliersDB = loadSuppliers()
  const index = suppliersDB.findIndex(s => s.id === id)
  if (index === -1) return res.status(404).json({ erro: 'Fornecedor não encontrado!' })

  suppliersDB[index] = { ...suppliersDB[index], ...req.body, id }
  saveSuppliers()
  res.json(suppliersDB[index])
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  suppliersDB = loadSuppliers()
  const index = suppliersDB.findIndex(s => s.id === id)
  if (index === -1) return res.status(404).json({ erro: 'Fornecedor não encontrado!' })

  const deleted = suppliersDB.splice(index, 1)
  saveSuppliers()
  res.json(deleted[0])
})

module.exports = router
