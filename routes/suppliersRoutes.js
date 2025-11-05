const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', async (req, res) => {
  try {
    const { id, supplier_name } = req.query;
    if (id) {
      const s = await Supplier.findById(id);
      if (!s) return res.status(404).json({ erro: 'Fornecedor não encontrado!' });
      return res.json(s);
    }
    if (supplier_name) {
      const results = await Supplier.find({ supplier_name: new RegExp(supplier_name, 'i') });
      return res.json(results);
    }
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar fornecedores', detalhes: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ erro: 'Fornecedor não encontrado!' });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ erro: 'ID inválido' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { supplier_name, supplier_category, contact_email, phone_number, status } = req.body;
    if (!supplier_name || !supplier_category || !contact_email || !phone_number)
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' });

    const novo = new Supplier({ supplier_name, supplier_category, contact_email, phone_number, status: status || 'on' });
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar fornecedor', detalhes: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ erro: 'Fornecedor não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar fornecedor', detalhes: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ erro: 'Fornecedor não encontrado!' });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao excluir fornecedor' });
  }
});

module.exports = router;
