// routes/usersRoutes.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
// Módulo para gerar IDs únicos (se for usar o UUID, precisa instalar: npm install uuid)
// Caso não instale, pode usar um ID simples baseado em timestamp ou o ID de mock.

// Caminho absoluto para o arquivo de dados
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// --- Funções Auxiliares para Manipulação de Arquivos ---

// Lê os dados do arquivo JSON
function readData() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler users.json:", error);
        return []; // Retorna um array vazio se o arquivo não existir ou estiver inválido
    }
}

// Escreve os dados no arquivo JSON
function writeData(data) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Erro ao escrever users.json:", error);
    }
}

// --- ROTAS CRUD ---

// 1. GET: Listar todos os usuários (Read All)
router.get('/', (req, res) => {
    const users = readData();
    res.json(users);
});

// 2. GET: Buscar usuário por ID ou Nome (Read One / Search)
// Exemplo de uso: GET /users/7a6cc128... ou GET /users/search?name=Karen
router.get('/:id', (req, res) => {
    const users = readData();
    const id = req.params.id;

    // Busca exata por ID
    const user = users.find(u => u.id === id);

    if (user) {
        return res.json(user);
    }

    // Se não encontrou por ID, pode implementar uma busca mais flexível aqui
    return res.status(404).json({ message: 'Usuário não encontrado.' });
});

// 3. POST: Criar novo usuário (Create)
router.post('/', (req, res) => {
    const users = readData();
    const newUser = req.body;

    // Validação básica (garantir campos essenciais)
    if (!newUser.name || !newUser.contact_email || !newUser.user || !newUser.pwd || !newUser.level) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    // Gerar um ID (usando um ID mock simples, use UUID em produção)
    const newId = `user_${Date.now()}`;
    
    // Constrói o objeto final do usuário
    const userWithId = {
        id: newId,
        ...newUser,
        status: newUser.status || 'on' // Define 'on' como padrão se não for fornecido
    };

    users.push(userWithId);
    writeData(users);

    // Retorna o novo usuário criado com status 201 (Created)
    res.status(201).json(userWithId);
});

// 4. PUT: Atualizar usuário por ID (Update)
router.put('/:id', (req, res) => {
    const users = readData();
    const id = req.params.id;
    const updateData = req.body;

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex !== -1) {
        // Atualiza apenas os campos fornecidos, mantendo os existentes
        users[userIndex] = {
            ...users[userIndex],
            ...updateData
        };
        
        writeData(users);
        return res.json(users[userIndex]);
    }

    res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
});

// 5. DELETE: Remover usuário por ID (Delete)
router.delete('/:id', (req, res) => {
    const users = readData();
    const id = req.params.id;

    const initialLength = users.length;
    
    // Filtra para remover o usuário com o ID correspondente
    const updatedUsers = users.filter(u => u.id !== id);

    if (updatedUsers.length < initialLength) {
        writeData(updatedUsers);
        return res.status(200).json({ message: `Usuário ${id} removido com sucesso.` });
    }

    res.status(404).json({ message: 'Usuário não encontrado para remoção.' });
});

module.exports = router;