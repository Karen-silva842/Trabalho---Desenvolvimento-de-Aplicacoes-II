const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - contact_email
 *         - user
 *         - pwd
 *         - level
 *       properties:
 *         id:
 *           type: string
 *           description: ID do usuário
 *         name:
 *           type: string
 *           description: Nome completo
 *         contact_email:
 *           type: string
 *           description: E-mail de contato
 *         user:
 *           type: string
 *           description: Nome de usuário
 *         pwd:
 *           type: string
 *           description: Senha
 *         level:
 *           type: string
 *           description: Nível de acesso (presidente, admin, vendedor)
 *         status:
 *           type: string
 *           description: Status do usuário (on/off)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Buscar usuários com filtros
 *     tags: [Usuários]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID do usuário
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do usuário
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  try {
    const { id, name } = req.query;

    if (id) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado!' });
      return res.json(user);
    }

    let query = {};
    if (name) query.name = new RegExp(name, 'i');

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: err.message });
  }
});

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Buscar todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Todos os usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
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
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado!' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Criar novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post('/', async (req, res) => {
  try {
    const { name, contact_email, user, pwd, level, status } = req.body;
    
    if (!name || !contact_email || !user || !pwd || !level || !status) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const newUser = new User({ name, contact_email, user, pwd, level, status });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar usuário', details: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, contact_email, user, pwd, level, status } = req.body;
    
    if (!name || !contact_email || !user || !pwd || !level || !status) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando!' });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar usuário', details: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Excluir usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado!' });
    res.json({ message: 'Usuário excluído com sucesso', deleted });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir usuário', details: err.message });
  }
});

module.exports = router;