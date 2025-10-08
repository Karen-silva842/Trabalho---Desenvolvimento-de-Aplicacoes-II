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
        console.error("Erro ao salvar produtos:", err);
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
 *         date:
 *           type: string
 *           description: "Data de criação do produto (YYYY-MM-DD)"
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
 *     summary: Retorna todos os produtos ou busca por id, name ou date
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: "ID do produto"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: "Nome do produto"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: "Data de criação do produto (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: Produto(s) encontrado(s)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Product'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/', (req, res) => {
    productsDB = loadProducts();
    const { id, name, date } = req.query;

    let results = productsDB;

    if (id) results = results.filter(p => p.id === id);
    if (name) results = results.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    if (date) results = results.filter(p => p.date && p.date.includes(date));

    if (results.length === 0) return res.status(404).json({ erro: "Produto não encontrado!" });

    res.json(results.length === 1 ? results[0] : results);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    productsDB = loadProducts();
    const product = productsDB.find(p => p.id === id);
    if (!product) return res.status(404).json({ erro: "Produto não encontrado!" });
    res.json(product);
});

router.post('/', (req, res) => {
    const { name, description, price, stock_quantity, supplier_id, status } = req.body;
    if (!name || !description || !price || !stock_quantity || !supplier_id) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
    }

    productsDB = loadProducts();
    const newProduct = { id: uuidv4(), name, description, price, stock_quantity, supplier_id, status: status || 'on' };
    productsDB.push(newProduct);
    saveProducts();
    res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    productsDB = loadProducts();
    const index = productsDB.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ erro: "Produto não encontrado!" });

    productsDB[index] = { id, ...req.body };
    saveProducts();
    res.json(productsDB[index]);
});

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
