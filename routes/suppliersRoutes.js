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
 */

/**
 * @swagger
 * /supplier:
 *   get:
 *     summary: Retorna todos os fornecedores cadastrados
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: query
 *         name: supplier_name
 *         schema:
 *           type: string
 *         description: Nome do fornecedor para filtro
 *       - in: query
 *         name: created_at
 *         schema:
 *           type: string
 *         description: Data de criação do fornecedor para filtro
 *     responses:
 *       200:
 *         description: Lista de fornecedores cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
router.get('/', (req, res) => {
  suppliersDB = loadSuppliers()
  const { supplier_name, created_at } = req.query
  let result = suppliersDB

  if (supplier_name) {
    result = result.filter(s => s.supplier_name.toLowerCase().includes(supplier_name.toLowerCase()))
  }

  if (created_at) {
    result = result.filter(s => s.created_at && s.created_at.startsWith(created_at))
  }

  res.json(result)
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  suppliersDB = loadSuppliers()
  const supplier = suppliersDB.find(s => s.id === id)
  if (!supplier) return res.status(404).json({ erro: 'Fornecedor não encontrado!' })
  res.json(supplier)
})

router.post('/', (req, res) => {
  const { supplier_name, supplier_category, contact_email, phone_number, status } = req.body
  if (!supplier_name || !supplier_category || !contact_email || !phone_number) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' })
  }

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
