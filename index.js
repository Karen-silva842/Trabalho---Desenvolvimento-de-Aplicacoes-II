const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./routes/swagger');

// Importa as rotas
const usersRoutes = require('./routes/usersRoutes');
const suppliersRoutes = require('./routes/suppliersRoutes');
const storesRoutes = require('./routes/storeRoutes');
const productsRoutes = require('./routes/productRoutes');
const ordersRoutes = require('./routes/orderRoutes');
const campaignsRoutes = require('./routes/campaignRoutes');

// Middleware para ler JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/users', usersRoutes);
app.use('/suppliers', suppliersRoutes);
app.use('/stores', storesRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/campaigns', campaignsRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota principal
app.get('/', (req, res) => {
  res.send('API Central de Compras Ativa! Acesse <a href="/api-docs">/api-docs</a> para a documentação.');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
});
