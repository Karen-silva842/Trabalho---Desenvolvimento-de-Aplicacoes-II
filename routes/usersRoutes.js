const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

// Caminho do arquivo de dados
const DATA_PATH = path.join(__dirname, '../data/users.json')

// Função para carregar usuários
function loadUsers() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    return []
  }
}

// Função para salvar usuários
function saveUsers(users) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2))
}

// Buscar todos os usuários ou filtrar por id/name
router.get('/', (req, res) => {
  const { id, name } = req.query
  let users = loadUsers()

  if (id) users = users.filter(u => u.id === id)
  if (name) users = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()))

  if (users.length === 0) return res.status(404).json({ error: 'Usuário não encontrado!' })

  res.json(users.length === 1 ? users[0] : users)
})

// Retornar todos os usuários cadastrados
router.get('/all', (req, res) => {
  const users = loadUsers()
  if (users.length === 0) return res.status(404).json({ error: 'Nenhum usuário encontrado!' })
  res.json(users)
})

// Buscar usuário por ID
router.get('/:id', (req, res) => {
  const users = loadUsers()
  const user = users.find(u => u.id === req.params.id)
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado!' })
  res.json(user)
})

// Criar novo usuário
router.post('/', (req, res) => {
  const { name, contact_email, user, pwd, level, status } = req.body
  if (!name || !contact_email || !user || !pwd || !level || !status)
    return res.status(400).json({ error: 'Preencha todos os campos!' })

  const users = loadUsers()
  const newUser = { id: uuidv4(), name, contact_email, user, pwd, level, status }
  users.push(newUser)
  saveUsers(users)
  res.status(201).json(newUser)
})

// Atualizar usuário por ID
router.put('/:id', (req, res) => {
  const { name, contact_email, user, pwd, level, status } = req.body
  if (!name || !contact_email || !user || !pwd || !level || !status)
    return res.status(400).json({ error: 'Campos obrigatórios faltando!' })

  const users = loadUsers()
  const index = users.findIndex(u => u.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado!' })

  const updatedUser = { id: req.params.id, name, contact_email, user, pwd, level, status }
  users[index] = updatedUser
  saveUsers(users)
  res.json(updatedUser)
})

// Excluir usuário por ID
router.delete('/:id', (req, res) => {
  const users = loadUsers()
  const index = users.findIndex(u => u.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado!' })

  const deleted = users.splice(index, 1)
  saveUsers(users)
  res.json(deleted[0])
})

module.exports = router
