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
        return "Saved";
    } catch (err) {
        return "Not saved";
    }
}

router.get('/', (req, res) => {
    usersDB = loadUsers();
    res.json(usersDB);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    usersDB = loadUsers();
    const user = usersDB.find(u => u.id === id);
    if (!user) return res.status(404).json({ erro: "Usuário não encontrado!" });
    res.json(user);
});

router.post('/', (req, res) => {
    const newUser = { id: uuidv4(), ...req.body };
    usersDB = loadUsers();
    usersDB.push(newUser);
    const result = saveUsers();
    console.log(result);
    res.json(newUser);
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const newUser = req.body;
    usersDB = loadUsers();
    const currentIndex = usersDB.findIndex(u => u.id === id);
    if (currentIndex === -1) return res.status(404).json({ erro: "Usuário não encontrado!" });
    usersDB[currentIndex] = { ...usersDB[currentIndex], ...newUser, id };
    const result = saveUsers();
    console.log(result);
    res.json(usersDB[currentIndex]);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    usersDB = loadUsers();
    const currentIndex = usersDB.findIndex(u => u.id === id);
    if (currentIndex === -1) return res.status(404).json({ erro: "Usuário não encontrado!" });
    const deleted = usersDB.splice(currentIndex, 1);
    const result = saveUsers();
    console.log(result);
    res.json(deleted);
});

module.exports = router;
