const express = require('express');
const fs = require('fs');
const router = express.Router();
const file = './data/store.json';

router.get('/', (req, res) => {
  const stores = JSON.parse(fs.readFileSync(file));
  res.json(stores);
});

router.get('/:id', (req, res) => {
  const stores = JSON.parse(fs.readFileSync(file));
  const store = stores.find(s => s.id === req.params.id);
  store ? res.json(store) : res.status(404).json({error: 'Loja não encontrada'});
});

router.post('/', (req, res) => {
  const stores = JSON.parse(fs.readFileSync(file));
  const nova = { id: Date.now().toString(), ...req.body };
  stores.push(nova);
  fs.writeFileSync(file, JSON.stringify(stores, null, 2));
  res.status(201).json(nova);
});

router.put('/:id', (req, res) => {
  const stores = JSON.parse(fs.readFileSync(file));
  const index = stores.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({error:'Loja não encontrada'});
  stores[index] = { ...stores[index], ...req.body };
  fs.writeFileSync(file, JSON.stringify(stores, null, 2));
  res.json(stores[index]);
});

router.delete('/:id', (req, res) => {
  let stores = JSON.parse(fs.readFileSync(file));
  const novaLista = stores.filter(s => s.id !== req.params.id);
  fs.writeFileSync(file, JSON.stringify(novaLista, null, 2));
  res.json({message: 'Loja removida'});
});

module.exports = router;
