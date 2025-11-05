const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/', async (req, res) => {
  try {
    const { id, name } = req.query;
    if (id) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ erro: 'Usuário não encontrado!' });
      return res.json(user);
    }
    if (name) {
      const users = await User.find({ name: new RegExp(name, 'i') });
      if (users.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado!' });
      return res.json(users.length === 1 ? users[0] : users);
    }
    const users = await User.find();
    if (users.length === 0) return res.status(404).json({ erro: 'Nenhum usuário encontrado!' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários', detalhes: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) return res.status(404).json({ erro: 'Nenhum usuário encontrado!' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado!' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ erro: 'ID inválido' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, contact_email, user, pwd, level, status } = req.body;
    if (!name || !contact_email || !user || !pwd || !level || !status)
      return res.status(400).json({ erro: 'Preencha todos os campos!' });

    const newUser = new User({ name, contact_email, user, pwd, level, status });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar usuário', detalhes: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, contact_email, user, pwd, level, status } = req.body;
    if (!name || !contact_email || !user || !pwd || !level || !status)
      return res.status(400).json({ erro: 'Campos obrigatórios faltando!' });

    const updated = await User.findByIdAndUpdate(req.params.id, { name, contact_email, user, pwd, level, status }, { new: true });
    if (!updated) return res.status(404).json({ erro: 'Usuário não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar usuário', detalhes: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ erro: 'Usuário não encontrado!' });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao excluir usuário' });
  }
});

module.exports = router;
