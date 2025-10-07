const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var usersDB = loadUsers();

function loadUsers() {
    try {
        return JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function saveUsers() {
    try {
        fs.writeFileSync('./data/users.json', JSON.stringify(usersDB, null, 2));
        return "Salvo";
    } catch (err) {
        return "Não salvo";
    }
}

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Rotas para gerenciamento de usuários
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna todos os usuários cadastrados
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários cadastrados
 */
router.get('/', (req, res) => {
    usersDB = loadUsers();
    res.json(usersDB);
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retorna um usuário específico pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    usersDB = loadUsers();
    const user = usersDB.find(u => u.id === id);
    if (!user)
        return res.status(404).json({ erro: "Usuário não encontrado!" });
    res.json(user);
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 */
router.post('/', (req, res) => {
    const newUser = { id: uuidv4(), ...req.body };
    usersDB = loadUsers();
    usersDB.push(newUser);
    saveUsers();
    res.status(201).json(newUser);
});

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
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
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const newUser = req.body;
    usersDB = loadUsers();
    const currentIndex = usersDB.findIndex(u => u.id === id);
    if (currentIndex === -1)
        return res.status(404).json({ erro: "Usuário não encontrado!" });
    usersDB[currentIndex] = { ...usersDB[currentIndex], ...newUser, id };
    saveUsers();
    res.json(usersDB[currentIndex]);
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    usersDB = loadUsers();
    const currentIndex = usersDB.findIndex(u => u.id === id);
    if (currentIndex === -1)
        return res.status(404).json({ erro: "Usuário não encontrado!" });
    const deleted = usersDB.splice(currentIndex, 1);
    saveUsers();
    res.json(deleted);
});

module.exports = router;
