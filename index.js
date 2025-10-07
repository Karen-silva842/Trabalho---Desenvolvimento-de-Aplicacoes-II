const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Importa as rotas
const usersRoutes = require('./routes/usersRoutes');
const suppliersRoutes = require('./routes/suppliersRoutes');
const orderRoutes = require('./routes/orderRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usa as rotas
app.use('/users', usersRoutes);
app.use('/suppliers', suppliersRoutes);
app.use('/orders', orderRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/products', productRoutes);
app.use('/stores', storeRoutes);

// Swagger separado
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('API Central de Compras Ativa! Acesse <a href="/api-docs">/api-docs</a> para a documentação.');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger em http://localhost:${port}/api-docs`);
});
