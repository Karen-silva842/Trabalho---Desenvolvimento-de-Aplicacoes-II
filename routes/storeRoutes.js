const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// Middleware para interpretar JSON no corpo da requisição
router.use(express.json());

// Buscar lojas com filtros opcionais (id e store_name)
router.get('/', async (req, res) => {
  try {
    const { id, store_name } = req.query;

    if (id) {
      const store = await Store.findById(id);
      if (!store) return res.status(404).json({ error: 'Loja não encontrada!' });
      return res.json(store);
    }

    let query = {};
    if (store_name) query.store_name = new RegExp(store_name, 'i');

    const stores = await Store.find(query);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar lojas', details: err.message });
  }
});

// Buscar loja por ID
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: 'Loja não encontrada!' });
    res.json(store);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

// Criar nova loja
router.post('/', async (req, res) => {
  try {
    const { store_name, cnpj, address, phone_number, contact_email, status } = req.body;

    if (!store_name || !cnpj || !address || !phone_number || !contact_email || !status) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const newStore = new Store({ store_name, cnpj, address, phone_number, contact_email, status });
    await newStore.save();
    res.status(201).json(newStore);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar loja', details: err.message });
  }
});

// Atualizar loja por ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Loja não encontrada!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar loja', details: err.message });
  }
});

// Excluir loja por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Store.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Loja não encontrada!' });
    res.json({ message: 'Loja excluída com sucesso', deleted });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir loja', details: err.message });
  }
});

module.exports = router;
