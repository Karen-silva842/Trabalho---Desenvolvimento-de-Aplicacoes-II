const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./routes/swagger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão MongoDB SIMPLIFICADA (sem opções deprecated)
mongoose.connect('mongodb://localhost:27017/central_compras')
.then(() => {
  console.log('✅ Conectado ao MongoDB com sucesso!');
})
.catch((error) => {
  console.error('❌ Erro ao conectar com MongoDB:', error.message);
  process.exit(1);
});

// ✅ SWAGGER CONFIGURADO ANTES DAS ROTAS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Central de Compras - Documentação"
}));

// Importar rotas
const campaignRoutes = require('./routes/campaignRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');
const suppliersRoutes = require('./routes/suppliersRoutes');
const usersRoutes = require('./routes/usersRoutes');

// Usar rotas
app.use('/api/campaigns', campaignRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/users', usersRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🏪 Bem-vindo à API Central de Compras!',
    documentation: '/api-docs',
    endpoints: {
      users: '/api/users',
      suppliers: '/api/suppliers', 
      stores: '/api/stores',
      products: '/api/products',
      orders: '/api/orders',
      campaigns: '/api/campaigns'
    }
  });
});

// Rota de saúde da API
app.get('/health', (req, res) => {
  res.json({ 
    status: '✅ OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ CORRETO - Middleware de tratamento de erro 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      documentation: 'GET /api-docs',
      users: 'GET /api/users',
      suppliers: 'GET /api/suppliers',
      stores: 'GET /api/stores', 
      products: 'GET /api/products',
      orders: 'GET /api/orders',
      campaigns: 'GET /api/campaigns'
    }
  });
});

// Middleware de tratamento de erro global
app.use((error, req, res, next) => {
  console.error('❌ Erro:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: error.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('http://localhost:' + PORT + '/api-docs');
});