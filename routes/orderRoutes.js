const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *         - unit_price
 *       properties:
 *         product_id:
 *           type: string
 *           description: ID do produto
 *         quantity:
 *           type: number
 *           description: Quantidade
 *         campaign_id:
 *           type: string
 *           description: ID da campanha
 *         unit_price:
 *           type: string
 *           description: Preço unitário
 *     Order:
 *       type: object
 *       required:
 *         - store_id
 *         - item
 *         - total_amount
 *         - status
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: ID do pedido
 *         store_id:
 *           type: string
 *           description: ID da loja
 *         item:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Itens do pedido
 *         total_amount:
 *           type: string
 *           description: Valor total
 *         status:
 *           type: string
 *           description: Status do pedido
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do pedido
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: err.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cadastra um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar pedido', details: err.message });
  }
});

/**
 * @swagger
 * /api/orders/search:
 *   get:
 *     summary: Busca pedidos por ID e data
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID do pedido
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Data do pedido
 *     responses:
 *       200:
 *         description: Pedidos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/search', async (req, res) => {
  try {
    const { id, date } = req.query;
    let query = {};

    if (id) {
      query._id = id;
    }
    if (date) {
      query.date = date;
    }

    const orders = await Order.find(query);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Retorna um pedido específico pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
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
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado!' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Pedido não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar pedido', details: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Exclui um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido excluído com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Pedido não encontrado!' });
    res.json({ message: 'Pedido excluído com sucesso', deleted });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir pedido', details: err.message });
  }
});

module.exports = router;