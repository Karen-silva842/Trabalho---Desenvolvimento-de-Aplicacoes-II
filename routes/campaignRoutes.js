const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

let campaignsDB = loadCampaigns()

function loadCampaigns() {
  try {
    return JSON.parse(fs.readFileSync('./data/campaign.json', 'utf8'))
  } catch (err) {
    return []
  }
}

function saveCampaigns() {
  try {
    fs.writeFileSync('./data/campaign.json', JSON.stringify(campaignsDB, null, 2))
    return 'Saved'
  } catch (err) {
    return 'Not saved'
  }
}

/**
 * @swagger
 * tags:
 *   - name: Campanhas
 *     description: Rotas relacionadas às campanhas promocionais
 */

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Lista todas as campanhas
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Lista de campanhas retornada com sucesso
 */
router.get('/', (req, res) => {
  campaignsDB = loadCampaigns()
  res.json(campaignsDB)
})

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Busca uma campanha pelo ID
 *     tags: [Campaigns]
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
 *       404:
 *         description: Campanha não encontrada
 */
router.get('/:id', (req, res) => {
  const id = req.params.id
  campaignsDB = loadCampaigns()
  const campaign = campaignsDB.find(c => c.id === id)
  if (!campaign) return res.status(404).json({ erro: "Campanha não encontrada!" })
  res.json(campaign)
})

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Cadastra uma nova campanha
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               dataInicio:
 *                 type: string
 *                 format: date
 *               dataFim:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso
 */
router.post('/', (req, res) => {
  const newCampaign = { id: uuidv4(), ...req.body }
  campaignsDB = loadCampaigns()
  campaignsDB.push(newCampaign)
  saveCampaigns()
  res.status(201).json(newCampaign)
})

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Atualiza uma campanha existente
 *     tags: [Campaigns]
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
 *             type: object
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso
 *       404:
 *         description: Campanha não encontrada
 */
router.put('/:id', (req, res) => {
  const id = req.params.id
  const newCampaignData = req.body
  campaignsDB = loadCampaigns()
  const index = campaignsDB.findIndex(c => c.id === id)
  if (index === -1) return res.status(404).json({ erro: "Campanha não encontrada!" })
  campaignsDB[index] = { ...campaignsDB[index], ...newCampaignData }
  saveCampaigns()
  res.json(campaignsDB[index])
})

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Remove uma campanha pelo ID
 *     tags: [Campaigns]
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
 *       404:
 *         description: Campanha não encontrada
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id
  campaignsDB = loadCampaigns()
  const index = campaignsDB.findIndex(c => c.id === id)
  if (index === -1) return res.status(404).json({ erro: "Campanha não encontrada!" })
  const deleted = campaignsDB.splice(index, 1)
  saveCampaigns()
  res.json(deleted[0])
})

module.exports = router
