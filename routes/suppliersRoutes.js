const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// Middleware para interpretar JSON no corpo da requisição
router.use(express.json());

// Buscar fornecedores com filtros opcionais (id e supplier_name)
router.get('/', async (req, res) => {
  try {
    const { id, supplier_name } = req.query;

    if (id) {
      const supplier = await Supplier.findById(id);
      if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado!' });
      return res.json(supplier);
    }

    let query = {};
    if (supplier_name) query.supplier_name = new RegExp(supplier_name, 'i');

    const suppliers = await Supplier.find(query);
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar fornecedores', details: err.message });
  }
});

// Buscar fornecedor por ID
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

// Criar novo fornecedor
router.post('/', async (req, res) => {
  try {
    const { supplier_name, supplier_category, contact_email, phone_number, status } = req.body;

    if (!supplier_name || !supplier_category || !contact_email || !phone_number) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios!' });
    }

    const newSupplier = new Supplier({
      supplier_name,
      supplier_category,
      contact_email,
      phone_number,
      status: status || 'on'
    });

    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar fornecedor', details: err.message });
  }
});

// Atualizar fornecedor por ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar fornecedor', details: err.message });
  }
});

// Excluir fornecedor por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    res.json({ message: 'Fornecedor excluído com sucesso', deleted });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir fornecedor', details: err.message });
  }
});

module.exports = router;
