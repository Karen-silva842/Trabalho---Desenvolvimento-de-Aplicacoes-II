const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var storesDB = loadStores();

function loadStores() {
try {
return JSON.parse(fs.readFileSync('./src/db/store.json', 'utf8'));
} catch (err) {
return [];
}
}

function saveStores() {
try {
fs.writeFileSync('./src/db/store.json', JSON.stringify(storesDB, null, 2));
return "Salvo";
} catch (err) {
return "Não salvo";
}
}

/**
* @swagger
* tags:
* name: Lojas
* description: Rotas para gerenciamento das lojas
*/

/**
* @swagger
* /store:
* get:
* summary: Retorna todas as lojas cadastradas
* tags: [Lojas]
* responses:
* 200:
* description: Lista de todas as lojas cadastradas
*/
router.get('/', (req, res) => {
storesDB = loadStores();
res.json(storesDB);
});

/**
* @swagger
* /store/{id}:
* get:
* summary: Retorna uma loja específica pelo ID
* tags: [Lojas]
* parameters:
* - in: path
* name: id
* required: true
* description: ID da loja
* schema:
* type: string
* responses:
* 200:
* description: Loja encontrada
* 404:
* description: Loja não encontrada
*/
router.get('/:id', (req, res) => {
const id = req.params.id;
storesDB = loadStores();
var store = storesDB.find((store) => store.id === id);
if (!store)
return res.status(404).json({
"erro": "Loja não encontrada!"
});
res.json(store);
});

/**
* @swagger
* /store:
* post:
* summary: Cria uma nova loja
* tags: [Lojas]
* requestBody:
* required: true
* content:
* application/json:
* schema:
* type: object
* properties:
* nome:
* type: string
* description: Nome da loja
* endereco:
* type: string
* description: Endereço da loja
* telefone:
* type: string
* description: Telefone de contato
* responses:
* 201:
* description: Loja criada com sucesso
*/
router.post('/', (req, res) => {
const newStore = {
id: uuidv4(),
...req.body
};
storesDB = loadStores();
storesDB.push(newStore);
saveStores();
return res.status(201).json(newStore);
});

/**
* @swagger
* /store/{id}:
* put:
* summary: Atualiza uma loja existente
* tags: [Lojas]
* parameters:
* - in: path
* name: id
* required: true
* description: ID da loja
* schema:
* type: string
* requestBody:
* required: true
* content:
* application/json:
* schema:
* type: object
* properties:
* nome:
* type: string
* endereco:
* type: string
* telefone:
* type: string
* responses:
* 200:
* description: Loja atualizada com sucesso
* 404:
* description: Loja não encontrada
*/
router.put('/:id', (req, res) => {
const id = req.params.id;
const newStore = req.body;
storesDB = loadStores();
const currentIndex = storesDB.findIndex((store) => store.id === id);
if (currentIndex === -1)
return res.status(404).json({
"erro": "Loja não encontrada!"
});
storesDB[currentIndex] = { id, ...newStore };
saveStores();
return res.json(storesDB[currentIndex]);
});

/**
* @swagger
* /store/{id}:
* delete:
* summary: Remove uma loja pelo ID
* tags: [Lojas]
* parameters:
* - in: path
* name: id
* required: true
* description: ID da loja
* schema:
* type: string
* responses:
* 200:
* description: Loja removida com sucesso
* 404:
* description: Loja não encontrada
*/
router.delete('/:id', (req, res) => {
const id = req.params.id;
storesDB = loadStores();
const currentIndex = storesDB.findIndex((store) => store.id === id);
if (currentIndex === -1)
return res.status(404).json({
"erro": "Loja não encontrada!"
});
var deletado = storesDB.splice(currentIndex, 1);
saveStores();
res.json(deletado);
});

module.exports = router;