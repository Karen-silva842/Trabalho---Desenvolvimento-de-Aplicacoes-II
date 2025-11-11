const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// Middleware para garantir que o corpo da requisição seja JSON
router.use(express.json());

// Buscar campanhas com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { id, name, start_date, end_date } = req.query;

    if (id) {
      const campaign = await Campaign.findById(id);
      if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada!' });
      return res.json(campaign);
    }

    let query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (start_date) query.start_date = start_date;
    if (end_date) query.end_date = end_date;

    const campaigns = await Campaign.find(query);
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar campanhas', details: err.message });
  }
});

// Buscar todas as campanhas
router.get('/all', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar campanhas', details: err.message });
  }
});

// Buscar campanha por ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada!' });
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

// Criar nova campanha
router.post('/', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar campanha', details: err.message });
  }
});

// Atualizar campanha por ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Campanha não encontrada!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar campanha', details: err.message });
  }
});

// Excluir campanha por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Campanha não encontrada!' });
    res.json({ message: 'Campanha excluída com sucesso', deleted });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir campanha', details: err.message });
  }
});

module.exports = router;
