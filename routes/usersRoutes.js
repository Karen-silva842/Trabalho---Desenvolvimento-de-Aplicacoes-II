// routes/usersRoutes.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Caminho absoluto para o arquivo de dados
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// --- Funções Auxiliares ---
function readData() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler users.json:", error);
        return [];
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Erro ao escrever users.json:", error);
    }
}

// --- ROTAS CRUD ---

// 1. GET: Listar todos os usuários
router.get('/', (req, res) => {
    const users = readData();
    res.json(users);
});

// 2. GET: Buscar usuário por nome
router.get('/search', (req, res) => {
    const users = readData();
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Parâmetro "name" é obrigatório.' });
    }

    const result = users.filter(u =>
        u.name.toLowerCase().includes(name.toLowerCase())
    );

    if (result.length > 0) {
        return res.json(result);
    }

    res.status(404).json({ message: 'Nenhum usuário encontrado com esse nome.' });
});

// 3. GET: Buscar usuário por ID
router.get('/:id', (req, res) => {
    const users = readData();
    const id = req.params.id;

    const user = users.find(u => u.id === id);

    if (user) {
        return res.json(user);
    }

    res.status(404).json({ message: 'Usuário não encontrado.' });
});

// 4. POST: Criar novo usuário
router.post('/', (req, res) => {
    const users = readData();
    const newUser = req.body;

    if (!newUser.name || !newUser.contact_email || !newUser.user || !newUser.pwd || !newUser.level) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const newId = `user_${Date.now()}`;
    const userWithId = {
        id: newId,
        ...newUser,
        status: newUser.status || 'on'
    };

    users.push(userWithId);
    writeData(users);

    res.status(201).json(userWithId);
});

// 5. PUT: Atualizar usuário por ID
router.put('/:id', (req, res) => {
    const users = readData();
    const id = req.params.id;
    const updateData = req.body;

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            ...updateData
        };
        writeData(users);
        return res.json(users[userIndex]);
    }

    res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
});

// 6. DELETE: Remover usuário por ID
router.delete('/:id', (req, res) => {
    const users = readData();
    const id = req.params.id;

    const updatedUsers = users.filter(u => u.id !== id);

    if (updatedUsers.length < users.length) {
        writeData(updatedUsers);
        return res.status(200).json({ message: `Usuário ${id} removido com sucesso.` });
    }

    res.status(404).json({ message: 'Usuário não encontrado para remoção.' });
});

module.exports = router;
