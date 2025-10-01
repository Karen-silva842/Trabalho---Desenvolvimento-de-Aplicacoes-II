const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var suppliersDB = loadSuppliers();

function loadSuppliers() {
    try {
        return JSON.parse(fs.readFileSync('./data/suppliers.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function saveSuppliers() {
    try {
        fs.writeFileSync('./data/suppliers.json', JSON.stringify(suppliersDB, null, 2));
        return "Saved";
    } catch (err) {
        return "Not saved";
    }
}

router.get('/', (req, res) => {
    suppliersDB = loadSuppliers();
    res.json(suppliersDB);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    suppliersDB = loadSuppliers();
    const supplier = suppliersDB.find(s => s.id === id);
    if (!supplier) return res.status(404).json({ erro: "Fornecedor não encontrado!" });
    res.json(supplier);
});

router.post('/', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ erro: "Preencha todos os campos!" });

    suppliersDB = loadSuppliers();
    const newSupplier = { id: uuidv4(), name, email, phone };
    suppliersDB.push(newSupplier);
    const result = saveSuppliers();
    console.log(result);
    res.json(newSupplier);
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    suppliersDB = loadSuppliers();
    const index = suppliersDB.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ erro: "Fornecedor não encontrado!" });

    suppliersDB[index] = { ...suppliersDB[index], ...req.body, id };
    const result = saveSuppliers();
    console.log(result);
    res.json(suppliersDB[index]);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    suppliersDB = loadSuppliers();
    const index = suppliersDB.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ erro: "Fornecedor não encontrado!" });

    const deleted = suppliersDB.splice(index, 1);
    const result = saveSuppliers();
    console.log(result);
    res.json(deleted);
});

module.exports = router;
