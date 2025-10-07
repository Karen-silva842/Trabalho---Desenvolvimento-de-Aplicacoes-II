const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let productsDB = loadProducts();

function loadProducts() {
    try {
        return JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function saveProducts() {
    try {
        fs.writeFileSync('./data/products.json', JSON.stringify(productsDB, null, 2));
        return "Salvo";
    } catch (err) {
        return "Não salvo";
    }
}

/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: Rotas para gerenciamento de produtos
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retorna todos os produtos cadastrados
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos cadastrados
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
 *               nome:
 *                 type: string
 *                 description: Nome do produto
 *               preco:
 *                 type: number
 *                 description: Preço do produto
 *               descricao:
 *                 type: string
 *                 description: Descrição do produto
 *               estoque:
 *                 type: integer
 *                 description: Quantidade em estoque
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
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
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               descricao:
 *                 type: string
 *               estoque:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
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

module.exports = router;
