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
 *     description: Rotas gerenciamento de fornecedores - Karen Suélen da Silva
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
 */
router.get('/', (req, res) => {
  suppliersDB = loadSuppliers()
  res.json(suppliersDB)
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
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do fornecedor
 *               email:
 *                 type: string
 *                 description: E-mail do fornecedor
 *               phone:
 *                 type: string
 *                 description: Telefone do fornecedor
 *     responses:
 *       201:
 *         description: Fornecedor cadastrado com sucesso
 *       400:
 *         description: Campos obrigatórios não preenchidos
 */
router.post('/', (req, res) => {
  const { name, email, phone } = req.body
  if (!name || !email || !phone) return res.status(400).json({ erro: 'Preencha todos os campos!' })

  suppliersDB = loadSuppliers()
  const newSupplier = { id: uuidv4(), name, email, phone }
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
 *         description: ID do fornecedor
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *       404:
 *         description: Fornecedor não encontrado
 */
router.put('/:id', (req, res) => {
  const id = req.params.id
  suppliersDB = loadSuppliers()
  const index = suppliersDB.findIndex(s => s.id === id)
  if (index === -1) return res.status(404).json({ erro: 'Fornecedor não encontrado!' })

  suppliersDB[index] = { ...suppliersDB[index], ...req.body, id }
  saveSuppliers()
  res.json(suppliersDB[index])
})

/**
 * @swagger
 * /supplier/{id}:
 *   delete:
 *     summary: Exclui um fornecedor pelo ID
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
 *         description: Fornecedor excluído com sucesso
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
  res.json(deleted[0]) // retorna apenas o objeto excluído
})

module.exports = router
