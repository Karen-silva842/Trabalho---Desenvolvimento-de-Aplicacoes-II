const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const filePath = "./data/order.json";

router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

router.get("/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const order = data.find(o => o.id === req.params.id);
  order ? res.json(order) : res.status(404).json({ msg: "Pedido não encontrado" });
});

router.post("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const newOrder = { id: uuidv4(), ...req.body };
  data.push(newOrder);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(newOrder);
});

router.put("/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const index = data.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ msg: "Pedido não encontrado" });

  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json(data[index]);
});

router.delete("/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(filePath));
  const newData = data.filter(o => o.id !== req.params.id);
  if (data.length === newData.length) return res.status(404).json({ msg: "Pedido não encontrado" });

  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
  res.json({ msg: "Pedido removido" });
});

// CORREÇÃO: exportar no estilo CommonJS
module.exports = router;
