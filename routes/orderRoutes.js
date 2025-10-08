const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let ordersDB = loadOrders();

function loadOrders() {
  try {
    return JSON.parse(fs.readFileSync('./data/order.json', 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveOrders() {
  try {
    fs.writeFileSync('./data/order.json', JSON.stringify(ordersDB, null, 2));
    return 'Salvo';
  } catch (err) {
    console.error('Erro ao salvar pedidos:', err);
    return 'Não salvo';
  }
}

/**
 * @swagger
 * tags:
 *   - name: Pedidos
 *     description: Rotas de gerenciamento de pedidos - Davi Mendes
 *
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         store_id:
 *           type: string
 *         product_id:
 *           type: string
 *         quantity:
 *           type: number
 *         campaign_id:
 *           type: string
 *         unit_price:
 *           type: string
 *         total_amount:
 *           type: string
 *         status:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         name:
 *           type: string
 *       required:
 *         - id
 *         - store_id
 *         - product_id
 *         - quantity
 *         - unit_price
 *         - total_amount
 *         - status
 *         - date
 *         - name
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', (req, res) => {
  ordersDB = loadOrders();
  res.json(ordersDB);
});

/**
 * @swagger
 * /orders/search:
 *   get:
 *     summary: Busca pedidos por ID, nome ou data
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID do pedido
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do pedido
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data do pedido (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Pedidos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Nenhum pedido encontrado
 */
router.get('/search', (req, res) => {
  const { id, name, date } = req.query;
  ordersDB = loadOrders();
  let results = ordersDB;

  if (id) results = results.filter(o => o.id === id);
  if (name) results = results.filter(o => o.name.toLowerCase().includes(name.toLowerCase()));
  if (date) results = results.filter(o => o.date.startsWith(date));

  if (results.length === 0) return res.status(404).json({ erro: 'Nenhum pedido encontrado!' });
  res.json(results);
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retorna um pedido específico pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', (req, res) => {
  const id = req.params.id;
  ordersDB = loadOrders();
  const order = ordersDB.find(o => o.id === id);
  if (!order) return res.status(404).json({ erro: 'Pedido não encontrado!' });
  res.json(order);
});

router.post('/', (req, res) => {
  const newOrder = { id: uuidv4(), ...req.body };
  ordersDB = loadOrders();
  ordersDB.push(newOrder);
  saveOrders();
  res.status(201).json(newOrder);
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const newOrderData = req.body;
  ordersDB = loadOrders();
  const index = ordersDB.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ erro: 'Pedido não encontrado!' });

  ordersDB[index] = { ...ordersDB[index], ...newOrderData };
  saveOrders();
  res.json(ordersDB[index]);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  ordersDB = loadOrders();
  const index = ordersDB.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ erro: 'Pedido não encontrado!' });

  const deleted = ordersDB.splice(index, 1);
  saveOrders();
  res.json(deleted[0]);
});

module.exports = router;
