const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { id, name } = req.query;
    if (id) {
      const p = await Product.findById(id);
      if (!p) return res.status(404).json({ erro: 'Produto não encontrado!' });
      return res.json(p);
    }
    if (name) {
      const results = await Product.find({ name: new RegExp(name, 'i') });
      return res.json(results);
    }
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produtos', detalhes: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ erro: 'Produto não encontrado!' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ erro: 'ID inválido' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock_quantity, supplier_id, status } = req.body;
    if (!name || !description || !price || !stock_quantity || !supplier_id)
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios' });

    const novo = new Product({ name, description, price, stock_quantity, supplier_id, status });
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar produto', detalhes: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ erro: 'Produto não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar produto', detalhes: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ erro: 'Produto não encontrado!' });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao excluir produto' });
  }
});

module.exports = router;
