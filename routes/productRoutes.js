const express = require('express');
const fs = require('fs');
const router = express.Router();
const file = './data/product.json';

router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(file));
  res.json(products);
});

router.get('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(file));
  const product = products.find(p => p.id === req.params.id);
  product ? res.json(product) : res.status(404).json({error: 'Produto não encontrado'});
});

router.post('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(file));
  const novo = { id: Date.now().toString(), ...req.body };
  products.push(novo);
  fs.writeFileSync(file, JSON.stringify(products, null, 2));
  res.status(201).json(novo);
});

router.put('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(file));
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({error:'Produto não encontrado'});
  products[index] = { ...products[index], ...req.body };
  fs.writeFileSync(file, JSON.stringify(products, null, 2));
  res.json(products[index]);
});

router.delete('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(file));
  const novaLista = products.filter(p => p.id !== req.params.id);
  fs.writeFileSync(file, JSON.stringify(novaLista, null, 2));
  res.json({message: 'Produto removido'});
});

module.exports = router;
