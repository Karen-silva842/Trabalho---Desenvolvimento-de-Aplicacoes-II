const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var productsDB = loadProducts();

function loadProducts() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/product.json', 'utf8'));
    } catch (err) {
      return [];
    }
}

function saveProducts() {
    try {
      fs.writeFileSync('./src/db/product.json', JSON.stringify(productsDB, null, 2));
      return "Saved"
    } catch (err) {
      return "Not saved";
    }
}

router.get('/', (req, res) =>{
    productsDB = loadProducts();
    res.json(productsDB);
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    productsDB = loadProducts();
    var product = productsDB.find((product) => product.id === id )
    if(!product) return res.status(404).json({
        "erro": "Produto não encontrado!"
    })
    res.json(product)
})

router.post('/', (req, res) => {
    const newProduct = {
        id: uuidv4(),
        ...req.body
    }
    productsDB = loadProducts();
    productsDB.push(newProduct)
    saveProducts();
    return res.json(newProduct)
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    const newProduct = req.body
    productsDB = loadProducts();
    const currentIndex = productsDB.findIndex((product) => product.id === id )
    if(currentIndex === -1) 
        return res.status(404).json({
        "erro": "Produto não encontrado!"
    })
    productsDB[currentIndex] = { id, ...newProduct }
    saveProducts();
    return res.json(productsDB[currentIndex])
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    productsDB = loadProducts();
    const currentIndex = productsDB.findIndex((product) => product.id === id )
    if(currentIndex === -1) return res.status(404).json({
        "erro": "Produto não encontrado!"
    })
    var deletado = productsDB.splice(currentIndex, 1)
    saveProducts();
    res.json(deletado)
})

module.exports = router;
