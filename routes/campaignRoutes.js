const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

router.get('/', async (req, res) => {
  try {
    const { id, name, start_date, end_date } = req.query;
    if (id) {
      const c = await Campaign.findById(id);
      if (!c) return res.status(404).json({ erro: 'Campanha não encontrada!' });
      return res.json(c);
    }
    let query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (start_date) query.start_date = start_date;
    if (end_date) query.end_date = end_date;
    const campaigns = await Campaign.find(query);
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar campanhas', detalhes: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const list = await Campaign.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar campanhas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ erro: 'Campanha não encontrada!' });
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ erro: 'ID inválido' });
  }
});

router.post('/', async (req, res) => {
  try {
    const novo = new Campaign(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar campanha', detalhes: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ erro: 'Campanha não encontrada!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar campanha', detalhes: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ erro: 'Campanha não encontrada!' });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao excluir campanha' });
  }
});

module.exports = router;
