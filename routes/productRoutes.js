const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // ✅ CORRETO: Product, não Order

router.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock_quantity
 *       properties:
 *         id:
 *           type: string
 *           description: ID do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         description:
 *           type: string
 *           description: Descrição do produto
 *         price:
 *           type: string
 *           description: Preço do produto
 *         stock_quantity:
 *           type: string
 *           description: Quantidade em estoque
 *         supplier_id:
 *           type: string
 *           description: ID do fornecedor
 *         status:
 *           type: string
 *           description: Status do produto (on/off)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Buscar produtos com filtros
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID do produto
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do produto
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', async (req, res) => {
  try {
    const { id, name } = req.query;

    if (id) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado!' });
      return res.json(product);
    }

    let query = {};
    if (name) query.name = new RegExp(name, 'i');

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos', details: err.message });
  }
});

/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Buscar todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Todos os produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos', details: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado!' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido', details: err.message });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar produto', details: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualizar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Produto não encontrado!' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar produto', details: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Excluir produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Produto não encontrado!' });
    res.json({ message: 'Produto excluído com sucesso', deleted });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao excluir produto', details: err.message });
  }
});

module.exports = router;