const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

router.get('/', async (req, res) => {
  try {
    const { id, store_name } = req.query;
    if (id) {
      const s = await Store.findById(id);
      if (!s) return res.status(404).json({ erro: 'Loja não encontrada!' });
      return res.json(s);
    }
    if (store_name) {
      const results = await Store.find({ store_name: new RegExp(store_name, 'i') });
      return res.json(results);
    }
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar lojas', detalhes: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ erro: 'Loja não encontrada!' });
    res.json(store);
  } catch (err) {
    res.status(400).json({ erro: 'ID inválido' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { store_name, cnpj, address, phone_number, contact_email, status } = req.body;
    if (!store_name || !cnpj || !address || !phone_number || !contact_email || !status)
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });

    const novo = new Store({ store_name, cnpj, address, phone_number, contact_email, status });
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar loja', detalhes: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ erro: 'Loja não encontrada!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar loja', detalhes: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Store.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ erro: 'Loja não encontrada!' });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao excluir loja' });
  }
});

module.exports = router;
