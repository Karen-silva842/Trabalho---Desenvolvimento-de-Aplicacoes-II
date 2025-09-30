// index.js (ou app.js)

const express = require('express');
const app = express();
const port = 3000;

// Importa as rotas
const usersRoutes = require('./routes/usersRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

// Middleware para processar JSON (necessário para POST/PUT)
app.use(express.json());
// routes/supplierRoutes.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Caminho para supplier.json
const suppliersFilePath = path.join(__dirname, '..', 'data', 'supplier.json');

// --- Funções Auxiliares ---
function readData() {
    try {
        const data = fs.readFileSync(suppliersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler supplier.json:", error);
        return [];
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(suppliersFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Erro ao escrever supplier.json:", error);
    }
}

// --- ROTAS CRUD ---

// 1. GET: Listar todos os fornecedores
router.get('/', (req, res) => {
    const suppliers = readData();
    res.json(suppliers);
});

// 2. GET: Buscar fornecedor por nome
router.get('/search', (req, res) => {
    const suppliers = readData();
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Parâmetro "name" é obrigatório.' });
    }

    const result = suppliers.filter(s =>
        s.supplier_name.toLowerCase().includes(name.toLowerCase())
    );

    if (result.length > 0) {
        return res.json(result);
    }

    res.status(404).json({ message: 'Nenhum fornecedor encontrado com esse nome.' });
});

// 3. GET: Buscar fornecedor por ID
router.get('/:id', (req, res) => {
    const suppliers = readData();
    const id = req.params.id;

    const supplier = suppliers.find(s => s.id === id);

    if (supplier) {
        return res.json(supplier);
    }

    res.status(404).json({ message: 'Fornecedor não encontrado.' });
});

// 4. POST: Criar novo fornecedor
router.post('/', (req, res) => {
    const suppliers = readData();
    const newSupplier = req.body;

    if (!newSupplier.supplier_name || !newSupplier.supplier_category || !newSupplier.contact_email || !newSupplier.phone_number) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const newId = `supplier_${Date.now()}`;
    const supplierWithId = {
        id: newId,
        ...newSupplier,
        status: newSupplier.status || 'on'
    };

    suppliers.push(supplierWithId);
    writeData(suppliers);

    res.status(201).json(supplierWithId);
});

// 5. PUT: Atualizar fornecedor por ID
router.put('/:id', (req, res) => {
    const suppliers = readData();
    const id = req.params.id;
    const updateData = req.body;

    const supplierIndex = suppliers.findIndex(s => s.id === id);

    if (supplierIndex !== -1) {
        suppliers[supplierIndex] = {
            ...suppliers[supplierIndex],
            ...updateData
        };
        writeData(suppliers);
        return res.json(suppliers[supplierIndex]);
    }

    res.status(404).json({ message: 'Fornecedor não encontrado para atualização.' });
});

// 6. DELETE: Remover fornecedor por ID
router.delete('/:id', (req, res) => {
    const suppliers = readData();
    const id = req.params.id;

    const updatedSuppliers = suppliers.filter(s => s.id !== id);

    if (updatedSuppliers.length < suppliers.length) {
        writeData(updatedSuppliers);
        return res.status(200).json({ message: `Fornecedor ${id} removido com sucesso.` });
    }

    res.status(404).json({ message: 'Fornecedor não encontrado para remoção.' });
});

module.exports = router;

// Monta as rotas
app.use('/users', usersRoutes);
app.use('/suppliers', supplierRoutes);

app.listen(port, () => {
  console.log(`API Central de Compras rodando em http://localhost:${port}`);
});