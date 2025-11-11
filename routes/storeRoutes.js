const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

router.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *         - store_name
 *         - cnpj
 *         - address
 *         - phone_number
 *         - contact_email
 *       properties:
 *         id:
 *           type: string
 *           description: ID da loja
 *         store_name:
 *           type: string
 *           description: Nome da loja
 *         cnpj:
 *           type: string
 *           description: CNPJ da loja
 *         address:
 *           type: string
 *           description: Endereço
 *         phone_number:
 *           type: string
 *           description: Telefone
 *         contact_email:
 *           type: string
 *           description: E-mail de contato
 *         status:
 *           type: string
 *           description: Status da loja (on/off)
 */

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Buscar lojas com filtros
 *     tags: [Lojas]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID da loja
 *       - in: query
 *         name: store_name
 *         schema:
 *           type: string
 *         description: Nome da loja
 *     responses:
 *       200:
 *         description: Lista de lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
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

/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Buscar loja por ID
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: 'Loja não encontrada!' });
    res.json(store);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Criar nova loja
 *     tags: [Lojas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
 *       400:
 *         description: Erro na requisição
 */
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

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Atualizar loja por ID
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Loja atualizada
 *       404:
 *         description: Loja não encontrada
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Loja não encontrada!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar loja', details: err.message });
  }
});

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Excluir loja por ID
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja excluída com sucesso
 *       404:
 *         description: Loja não encontrada
 */
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