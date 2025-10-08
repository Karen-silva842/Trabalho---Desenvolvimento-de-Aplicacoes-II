const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let productsDB = loadProducts();

function loadProducts() {
    try {
        return JSON.parse(fs.readFileSync('./data/product.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function saveProducts() {
    try {
        fs.writeFileSync('./data/product.json', JSON.stringify(productsDB, null, 2));
        return "Salvo";
    } catch (err) {
        return "Não salvo";
    }
}

/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: Rotas de gerenciamento de produtos - Bryan Gonçalves Pereira
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: string
 *         stock_quantity:
 *           type: string
 *         supplier_id:
 *           type: string
 *         status:
 *           type: string
 *       required:
 *         - id
 *         - name
 *         - description
 *         - price
 *         - stock_quantity
 *         - supplier_id
 *         - status
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retorna todos os produtos cadastrados
 *     tags: [Produtos]
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
router.get('/', (req, res) => {
    productsDB = loadProducts();
    res.json(productsDB);
});

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Retorna um produto específico pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
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
router.get('/:id', (req, res) => {
    const id = req.params.id;
    productsDB = loadProducts();
    const product = productsDB.find(p => p.id === id);
    if (!product) return res.status(404).json({ erro: "Produto não encontrado!" });
    res.json(product);
});

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Cadastra um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *               stock_quantity:
 *                 type: string
 *               supplier_id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post('/', (req, res) => {
    const newProduct = { id: uuidv4(), ...req.body };
    productsDB = loadProducts();
    productsDB.push(newProduct);
    saveProducts();
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *               stock_quantity:
 *                 type: string
 *               supplier_id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    productsDB = loadProducts();
    const index = productsDB.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ erro: "Produto não encontrado!" });
    productsDB[index] = { id, ...req.body };
    saveProducts();
    res.json(productsDB[index]);
});

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Exclui um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    productsDB = loadProducts();
    const index = productsDB.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ erro: "Produto não encontrado!" });
    const deleted = productsDB.splice(index, 1);
    saveProducts();
    res.json(deleted[0]);
});

/**
 * @swagger
 * /product/search:
 *   get:
 *     summary: Busca produtos por ID e nome
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filtra produto pelo ID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtra produto pelo nome
 *     responses:
 *       200:
 *         description: Lista de produtos filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/search', (req, res) => {
    productsDB = loadProducts();
    const { id, name } = req.query;

    let filtered = productsDB;

    if (id) filtered = filtered.filter(p => p.id === id);
    if (name) filtered = filtered.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));

    res.json(filtered);
});

module.exports = router;
