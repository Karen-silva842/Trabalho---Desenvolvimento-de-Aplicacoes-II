// index.js (ou app.js)

const express = require('express');
const app = express();
const port = 3000;

// Importa as rotas
const usersRoutes = require('./routes/usersRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

// Middleware para processar JSON (necessário para POST/PUT)
app.use(express.json());

// Monta as rotas
app.use('/users', usersRoutes);
app.use('/suppliers', supplierRoutes);

app.listen(port, () => {
  console.log(`API Central de Compras rodando em http://localhost:${port}`);
});