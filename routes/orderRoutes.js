const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const { id, date } = req.query;
    if (id) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ erro: 'Pedido não encontrado!' });
      return res.json(order);
    }
    if (date) {
      const orders = await Order.find({ date });
      return res.json(orders);
    }
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pedidos', detalhes: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { id, date } = req.query;
    let query = {};
    if (id) query._id = id;
    if (date) query.date = date;
    const results = await Order.find(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ erro: 'Erro na busca', detalhes: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ erro: 'Pedido não encontrado!' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ erro: 'ID inválido' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar pedido', detalhes: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ erro: 'Pedido não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar pedido', detalhes: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ erro: 'Pedido não encontrado!' });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao excluir pedido' });
  }
});

module.exports = router;
