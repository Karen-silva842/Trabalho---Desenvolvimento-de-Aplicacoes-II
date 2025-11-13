const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

router.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required:
 *         - supplier_id
 *         - name
 *         - start_date
 *         - end_date
 *         - discount_percentage
 *       properties:
 *         id:
 *           type: string
 *           description: ID da campanha
 *         supplier_id:
 *           type: string
 *           description: ID do fornecedor
 *         name:
 *           type: string
 *           description: Nome da campanha
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Data de início
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Data de término
 *         discount_percentage:
 *           type: string
 *           description: Percentual de desconto
 */

/**
 * @swagger
 * /api/campaigns/all:
 *   get:
 *     summary: Lista todas as campanhas cadastradas
 *     tags: [Campanhas]
 *     responses:
 *       200:
 *         description: Lista de campanhas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 */
router.get('/all', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar campanhas', details: err.message });
  }
});

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Lista campanhas com filtro por ID, nome e datas
 *     tags: [Campanhas]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID da campanha
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome da campanha
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *         description: Data de início
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *         description: Data de término
 *     responses:
 *       200:
 *         description: Lista de campanhas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 */
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

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Cadastra uma nova campanha
 *     tags: [Campanhas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post('/', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar campanha', details: err.message });
  }
});

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Retorna uma campanha específica pelo ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da campanha
 *     responses:
 *       200:
 *         description: Campanha encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campanha não encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada!' });
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

/**
 * @swagger
 * /api/campaigns/{id}:
 *   put:
 *     summary: Atualiza uma campanha existente
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da campanha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: Campanha atualizada
 *       404:
 *         description: Campanha não encontrada
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Campanha não encontrada!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar campanha', details: err.message });
  }
});

/**
 * @swagger
 * /api/campaigns/{id}:
 *   delete:
 *     summary: Exclui uma campanha pelo ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da campanha
 *     responses:
 *       200:
 *         description: Campanha excluída com sucesso
 *       404:
 *         description: Campanha não encontrada
 */
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