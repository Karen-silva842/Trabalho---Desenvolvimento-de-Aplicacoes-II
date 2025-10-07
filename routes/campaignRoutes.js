const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let campaignsDB = loadCampaigns();

function loadCampaigns() {
  try {
    return JSON.parse(fs.readFileSync('./data/campaign.json', 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveCampaigns() {
  try {
    fs.writeFileSync('./data/campaign.json', JSON.stringify(campaignsDB, null, 2));
    return 'Salvo';
  } catch (err) {
    console.error('Erro ao salvar campanhas:', err);
    return 'Não salvo';
  }
}

/**
 * @swagger
 * tags:
 *   - name: Campanhas
 *     description: Rotas de gerenciamento de campanhas - Davi Mendes
 *
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
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
 *           description: Data e hora de início da campanha
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: Data e hora de término da campanha
 *         discount_percentage:
 *           type: string
 *           description: Porcentagem de desconto da campanha
 *       required:
 *         - id
 *         - supplier_id
 *         - name
 *         - start_date
 *         - end_date
 *         - discount_percentage
 */

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Lista todas as campanhas
 *     tags: [Campanhas]
 *     responses:
 *       200:
 *         description: Lista de campanhas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 */
router.get('/', (req, res) => {
  campaignsDB = loadCampaigns();
  res.json(campaignsDB);
});

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Retorna uma campanha específica pelo ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da campanha
 *         schema:
 *           type: string
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
router.get('/:id', (req, res) => {
  const id = req.params.id;
  campaignsDB = loadCampaigns();
  const campaign = campaignsDB.find(c => c.id === id);
  if (!campaign) return res.status(404).json({ erro: 'Campanha não encontrada!' });
  res.json(campaign);
});

/**
 * @swagger
 * /campaigns:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 */
router.post('/', (req, res) => {
  const newCampaign = { id: uuidv4(), ...req.body };
  campaignsDB = loadCampaigns();
  campaignsDB.push(newCampaign);
  saveCampaigns();
  res.status(201).json(newCampaign);
});

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Atualiza uma campanha existente
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da campanha
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campanha não encontrada
 */
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const newCampaignData = req.body;
  campaignsDB = loadCampaigns();
  const index = campaignsDB.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ erro: 'Campanha não encontrada!' });

  campaignsDB[index] = { ...campaignsDB[index], ...newCampaignData };
  saveCampaigns();
  res.json(campaignsDB[index]);
});

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Exclui uma campanha pelo ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da campanha
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campanha removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campanha não encontrada
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  campaignsDB = loadCampaigns();
  const index = campaignsDB.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ erro: 'Campanha não encontrada!' });

  const deleted = campaignsDB.splice(index, 1);
  saveCampaigns();
  res.json(deleted[0]);
});

module.exports = router;
