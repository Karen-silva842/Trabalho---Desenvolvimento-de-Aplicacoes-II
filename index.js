const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./routes/swagger');

// Importa as rotas
const usersRoutes = require('./routes/usersRoutes');
const suppliersRoutes = require('./routes/suppliersRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRoutes);
app.use('/supplier', suppliersRoutes);
app.use('/store', storeRoutes);
app.use('/product', productRoutes);
app.use('/orders', orderRoutes);
app.use('/campaigns', campaignRoutes);

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
