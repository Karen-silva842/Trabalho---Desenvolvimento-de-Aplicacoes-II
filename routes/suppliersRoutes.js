const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - supplier_name
 *         - supplier_category
 *         - contact_email
 *         - phone_number
 *       properties:
 *         id:
 *           type: string
 *           description: ID do fornecedor
 *         supplier_name:
 *           type: string
 *           description: Nome do fornecedor
 *         supplier_category:
 *           type: string
 *           description: Categoria do fornecedor
 *         contact_email:
 *           type: string
 *           description: E-mail de contato
 *         phone_number:
 *           type: string
 *           description: Telefone
 *         status:
 *           type: string
 *           description: Status do fornecedor (on/off)
 */

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Buscar fornecedores com filtros
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *       - in: query
 *         name: supplier_name
 *         schema:
 *           type: string
 *         description: Nome do fornecedor
 *     responses:
 *       200:
 *         description: Lista de fornecedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
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

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Buscar fornecedor por ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Criar novo fornecedor
 *     tags: [Fornecedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *       400:
 *         description: Erro na requisição
 */
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

/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Atualizar fornecedor por ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado
 *       404:
 *         description: Fornecedor não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar fornecedor', details: err.message });
  }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Excluir fornecedor por ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor excluído com sucesso
 *       404:
 *         description: Fornecedor não encontrado
 */
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