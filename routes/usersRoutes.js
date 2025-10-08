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
 *         created_at:
 *           type: string
 *       required:
 *         - id
 *         - supplier_name
 *         - supplier_category
 *         - contact_email
 *         - phone_number
 *         - status
 */

/**
 * @swagger
 * /supplier:
 *   get:
 *     summary: Retorna todos os fornecedores cadastrados
 *     tags: [Fornecedores]
 *     responses:
 *       200:
 *         description: Lista de fornecedores cadastrados
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
  const { id, supplier_name, created_at } = req.query

  let results = suppliersDB

  if (id) results = results.filter(s => s.id === id)
  if (supplier_name) results = results.filter(s => s.supplier_name.toLowerCase().includes(supplier_name.toLowerCase()))
  if (created_at) results = results.filter(s => s.created_at && s.created_at.includes(created_at))

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
 *         description: "ID do fornecedor"
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
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Fornecedor cadastrado com sucesso
 *       400:
 *         description: Campos obrigatórios não preenchidos
 */
router.post('/', (req, res) => {
  const { supplier_name, supplier_category, contact_email, phone_number, status } = req.body
  if (!supplier_name || !supplier_category || !contact_email || !phone_number)
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' })

  suppliersDB = loadSuppliers()
  const newSupplier = { 
    id: uuidv4(), 
    supplier_name, 
    supplier_category, 
    contact_email, 
    phone_number, 
    status: status || 'on',
    created_at: new Date().toISOString()
  }
  suppliersDB.push(newSupplier)
  saveSuppliers()
  res.status(201).json(newSupplier)
})

/**
 * @swagger
 * /supplier/{id}:
 *   put:
 *     summary: Atualiza um fornecedor existente
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID do fornecedor a ser atualizado"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 */
router.put('/:id', (req, res) => {
  const id = req.params.id
  suppliersDB = loadSuppliers()
  const index = suppliersDB.findIndex(s => s.id === id)
  if (index === -1) return res.status(404).json({ erro: 'Fornecedor não encontrado!' })

  const { supplier_name, supplier_category, contact_email, phone_number, status } = req.body
  if (!supplier_name || !supplier_category || !contact_email || !phone_number)
    return res.status(400).json({ erro: 'Campos obrigatórios faltando!' })

  const updatedSupplier = { id, supplier_name, supplier_category, contact_email, phone_number, status }
  suppliersDB[index] = updatedSupplier
  saveSuppliers()
  res.json(updatedSupplier)
})

/**
 * @swagger
 * /supplier/{id}:
 *   delete:
 *     summary: Remove um fornecedor existente
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID do fornecedor a ser removido"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fornecedor removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 */
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
