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
      return "Saved"
    } catch (err) {
      return "Not saved";
    }
}

router.get('/', (req, res) =>{
    storesDB = loadStores();
    res.json(storesDB);
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    storesDB = loadStores();
    var store = storesDB.find((store) => store.id === id )
    if(!store) return res.status(404).json({
        "erro": "Loja não encontrada!"
    })
    res.json(store)
})

router.post('/', (req, res) => {
    const newStore = {
        id: uuidv4(),
        ...req.body
    }
    storesDB = loadStores();
    storesDB.push(newStore)
    saveStores();
    return res.json(newStore)
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    const newStore = req.body
    storesDB = loadStores();
    const currentIndex = storesDB.findIndex((store) => store.id === id )
    if(currentIndex === -1) 
        return res.status(404).json({
        "erro": "Loja não encontrada!"
    })
    storesDB[currentIndex] = { id, ...newStore }
    saveStores();
    return res.json(storesDB[currentIndex])
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    storesDB = loadStores();
    const currentIndex = storesDB.findIndex((store) => store.id === id )
    if(currentIndex === -1) return res.status(404).json({
        "erro": "Loja não encontrada!"
    })
    var deletado = storesDB.splice(currentIndex, 1)
    saveStores();
    res.json(deletado)
})

module.exports = router;
