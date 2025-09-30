const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');

// --- Importação de Rotas ---
const usersRoutes = require('./routes/usersRoutes');
const supplierRoutes = require('./routes/suppliersRoutes'); 
const orderRoutes = require('./routes/orderRoutes');       // NOVO: rotas de pedidos
const campaignRoutes = require('./routes/campaignRoutes'); // NOVO: rotas de campanhas

// --- Documentação Swagger ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Central de Compras',
    version: '1.0.0',
    description: 'Documentação da API REST para a Central de Compras (Desenvolvimento de Aplicações II)',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Servidor Local',
    },
  ],
  paths: {
    // --- Usuários ---
    '/users': {
      get: { summary: 'Lista todos os usuários', responses: { '200': { description: 'Lista de usuários retornada com sucesso.' } } },
      post: { summary: 'Cadastra novo usuário', responses: { '201': { description: 'Usuário criado com sucesso.' } } }
    },
    '/users/search': {
      get: {
        summary: 'Busca usuários pelo nome',
        parameters: [{ name: 'name', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Usuário(s) encontrado(s).' }, '404': { description: 'Nenhum usuário encontrado.' } }
      }
    },
    '/users/{id}': {
      get: { summary: 'Busca usuário pelo ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Usuário encontrado.' }, '404': { description: 'Usuário não encontrado.' } } },
      put: { summary: 'Atualiza usuário por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Usuário atualizado com sucesso.' }, '404': { description: 'Usuário não encontrado.' } } },
      delete: { summary: 'Remove usuário por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Usuário removido com sucesso.' }, '404': { description: 'Usuário não encontrado.' } } }
    },

    // --- Fornecedores ---
    '/suppliers': {
      get: { summary: 'Lista todos os fornecedores', responses: { '200': { description: 'Lista de fornecedores retornada com sucesso.' } } },
      post: { summary: 'Cadastra novo fornecedor', responses: { '201': { description: 'Fornecedor criado com sucesso.' } } }
    },
    '/suppliers/search': {
      get: {
        summary: 'Busca fornecedores pelo nome',
        parameters: [{ name: 'name', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Fornecedor(es) encontrado(s).' }, '404': { description: 'Nenhum fornecedor encontrado.' } }
      }
    },
    '/suppliers/{id}': {
      get: { summary: 'Busca fornecedor pelo ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Fornecedor encontrado.' }, '404': { description: 'Fornecedor não encontrado.' } } },
      put: { summary: 'Atualiza fornecedor por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Fornecedor atualizado com sucesso.' }, '404': { description: 'Fornecedor não encontrado.' } } },
      delete: { summary: 'Remove fornecedor por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Fornecedor removido com sucesso.' }, '404': { description: 'Fornecedor não encontrado.' } } }
    },

    // --- Pedidos ---
    '/orders': {
      get: { summary: 'Lista todos os pedidos', responses: { '200': { description: 'Lista de pedidos retornada com sucesso.' } } },
      post: { summary: 'Cadastra novo pedido', responses: { '201': { description: 'Pedido criado com sucesso.' } } }
    },
    '/orders/{id}': {
      get: { summary: 'Busca pedido pelo ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Pedido encontrado.' }, '404': { description: 'Pedido não encontrado.' } } },
      put: { summary: 'Atualiza pedido por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Pedido atualizado com sucesso.' } } },
      delete: { summary: 'Remove pedido por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Pedido removido com sucesso.' } } }
    },

    // --- Campanhas ---
    '/campaigns': {
      get: { summary: 'Lista todas as campanhas', responses: { '200': { description: 'Lista de campanhas retornada com sucesso.' } } },
      post: { summary: 'Cadastra nova campanha', responses: { '201': { description: 'Campanha criada com sucesso.' } } }
    },
    '/campaigns/{id}': {
      get: { summary: 'Busca campanha pelo ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Campanha encontrada.' }, '404': { description: 'Campanha não encontrada.' } } },
      put: { summary: 'Atualiza campanha por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Campanha atualizada com sucesso.' } } },
      delete: { summary: 'Remove campanha por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Campanha removida com sucesso.' } } }
    }
  }
};

// --- Middlewares Globais ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rotas ---
app.use('/users', usersRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/orders', orderRoutes);       // NOVO
app.use('/campaigns', campaignRoutes); // NOVO

// --- Swagger ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Rota Raiz ---
app.get('/', (req, res) => {
  res.send('API Central de Compras Ativa! Acesse <a href="/api-docs">/api-docs</a> para a documentação.');
});

// --- Inicialização do Servidor ---
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger em http://localhost:${port}/api-docs`);
});
