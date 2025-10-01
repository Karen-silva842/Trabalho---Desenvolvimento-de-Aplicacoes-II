const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const filePath = "./data/campaign.json";

router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

router.get("/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const campaign = data.find(c => c.id === req.params.id);
  campaign ? res.json(campaign) : res.status(404).json({ msg: "Campanha não encontrada" });
});

router.post("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const newCampaign = { id: uuidv4(), ...req.body };
  data.push(newCampaign);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(newCampaign);
});

router.put("/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const index = data.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ msg: "Campanha não encontrada" });

  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json(data[index]);
});

router.delete("/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(filePath));
  const newData = data.filter(c => c.id !== req.params.id);
  if (data.length === newData.length) return res.status(404).json({ msg: "Campanha não encontrada" });

  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
  res.json({ msg: "Campanha removida" });
});

module.exports = router;
