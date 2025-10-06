const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

var campaignsDB = loadCampaigns()

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

router.get('/', (req, res) => {
  console.log("GET /campaigns")
  campaignsDB = loadCampaigns()
  res.json(campaignsDB)
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  campaignsDB = loadCampaigns()
  const campaign = campaignsDB.find(c => c.id === id)
  if (!campaign) {
    return res.status(404).json({ "erro": "Campanha não encontrada!" })
  }
  res.json(campaign)
})

router.post('/', (req, res) => {
  const newCampaign = {
    id: uuidv4(),
    ...req.body
  }
  console.log(newCampaign)
  campaignsDB = loadCampaigns()
  campaignsDB.push(newCampaign)
  let result = saveCampaigns()
  console.log(result)
  return res.status(201).json(newCampaign)
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const newCampaignData = req.body
  campaignsDB = loadCampaigns()
  const currentCampaign = campaignsDB.find(c => c.id === id)
  const currentIndex = campaignsDB.findIndex(c => c.id === id)

  if (!currentCampaign) {
    return res.status(404).json({ "erro": "Campanha não encontrada!" })
  }

  campaignsDB[currentIndex] = { ...currentCampaign, ...newCampaignData }
  let result = saveCampaigns()
  console.log(result)
  return res.json(campaignsDB[currentIndex])
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  campaignsDB = loadCampaigns()
  const currentCampaign = campaignsDB.find(c => c.id === id)
  const currentIndex = campaignsDB.findIndex(c => c.id === id)

  if (!currentCampaign) {
    return res.status(404).json({ "erro": "Campanha não encontrada!" })
  }

  const deleted = campaignsDB.splice(currentIndex, 1)
  let result = saveCampaigns()
  console.log(result)
  res.json(deleted)
})

module.exports = router