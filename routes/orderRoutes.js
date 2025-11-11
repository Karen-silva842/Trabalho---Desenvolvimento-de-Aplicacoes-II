const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Middleware para interpretar JSON no corpo da requisição
router.use(express.json());

// Buscar pedidos com filtros opcionais (id e date)
router.get('/', async (req, res) => {
  try {
    const { id, date } = req.query;

    if (id) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ error: 'Pedido não encontrado!' });
      return res.json(order);
    }

    let query = {};
    if (date) query.date = date;

    const orders = await Order.find(query);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: err.message });
  }
});

// Buscar pedido por ID (rota específica)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado!' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

// Criar novo pedido
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar pedido', details: err.message });
  }
});

// Atualizar pedido por ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Pedido não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar pedido', details: err.message });
  }
});

// Excluir pedido por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Pedido não encontrado!' });
    res.json({ message: 'Pedido excluído com sucesso', deleted });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir pedido', details: err.message });
  }
});

module.exports = router;
