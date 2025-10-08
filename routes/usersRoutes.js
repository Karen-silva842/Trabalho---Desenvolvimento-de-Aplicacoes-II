const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

let usersDB = loadUsers()

function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync('./data/users.json', 'utf8'))
  } catch (err) {
    return []
  }
}

function saveUsers() {
  try {
    fs.writeFileSync('./data/users.json', JSON.stringify(usersDB, null, 2))
    return 'Salvo'
  } catch (err) {
    console.error('Erro ao salvar usuários:', err)
    return 'Não salvo'
  }
}

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: "Rotas de gerenciamento de usuários - Karen Suélen da Silva"
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: "ID único do usuário"
 *         name:
 *           type: string
 *           description: "Nome completo do usuário"
 *         contact_email:
 *           type: string
 *           description: "E-mail de contato do usuário"
 *         user:
 *           type: string
 *           description: "Login do usuário"
 *         pwd:
 *           type: string
 *           description: "Senha do usuário"
 *         level:
 *           type: string
 *           description: "Nível de acesso (presidente, admin, vendedor)"
 *         status:
 *           type: string
 *           description: "Status do usuário (on/off)"
 *         date:
 *           type: string
 *           description: "Data de criação do usuário (YYYY-MM-DD)"
 *       required:
 *         - id
 *         - name
 *         - contact_email
 *         - user
 *         - pwd
 *         - level
 *         - status
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários ou busca por id, name ou date
 *     tags: [Usuários]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: "ID do usuário"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: "Nome do usuário"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: "Data de criação do usuário (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: Usuário(s) encontrado(s)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/', (req, res) => {
  usersDB = loadUsers()
  const { id, name, date } = req.query

  let results = usersDB

  if (id) results = results.filter(u => u.id === id)
  if (name) results = results.filter(u => u.name.toLowerCase().includes(name.toLowerCase()))
  if (date) results = results.filter(u => u.date && u.date.includes(date))

  if (results.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado!' })

  res.json(results.length === 1 ? results[0] : results)
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário específico pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID do usuário"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', (req, res) => {
  const id = req.params.id
  usersDB = loadUsers()
  const user = usersDB.find(u => u.id === id)
  if (!user) return res.status(404).json({ erro: 'Usuário não encontrado!' })
  res.json(user)
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Campos obrigatórios não preenchidos
 */
router.post('/', (req, res) => {
  const { name, contact_email, user, pwd, level, status } = req.body
  if (!name || !contact_email || !user || !pwd || !level || !status)
    return res.status(400).json({ erro: 'Preencha todos os campos!' })

  usersDB = loadUsers()
  const newUser = { id: uuidv4(), name, contact_email, user, pwd, level, status }
  usersDB.push(newUser)
  saveUsers()
  res.status(201).json(newUser)
})

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID do usuário a ser atualizado"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', (req, res) => {
  const id = req.params.id
  usersDB = loadUsers()
  const index = usersDB.findIndex(u => u.id === id)
  if (index === -1) return res.status(404).json({ erro: 'Usuário não encontrado!' })

  const { name, contact_email, user, pwd, level, status } = req.body
  if (!name || !contact_email || !user || !pwd || !level || !status)
    return res.status(400).json({ erro: 'Campos obrigatórios faltando!' })

  const updatedUser = { id, name, contact_email, user, pwd, level, status }
  usersDB[index] = updatedUser
  saveUsers()
  res.json(updatedUser)
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID do usuário a ser removido"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id
  usersDB = loadUsers()
  const index = usersDB.findIndex(u => u.id === id)
  if (index === -1) return res.status(404).json({ erro: 'Usuário não encontrado!' })

  const deleted = usersDB.splice(index, 1)
  saveUsers()
  res.json(deleted[0])
})

module.exports = router
