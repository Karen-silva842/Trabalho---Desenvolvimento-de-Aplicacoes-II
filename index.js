// index.js (ou app.js)

const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');

// --- Importação de Rotas ---
// Certifique-se de que esses arquivos estão na pasta './routes'
const usersRoutes = require('./routes/usersRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
// Exemplo de outras rotas que você irá criar:
// const productRoutes = require('./routes/productRoutes');

// --- Configuração do Swagger (Documentação da API) ---
// *******************************************************************
// ATENÇÃO: Você deve criar este objeto 'swaggerDocument' 
// com a definição de todas as suas rotas e modelos de dados.
// Por enquanto, vou usar um mock (documento básico).
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
  // Você irá adicionar aqui as definições de schemas e paths (rotas)
  // para users, suppliers, products, etc.
  paths: {
    // Exemplo de como a rota /users deve ser documentada
    '/users': {
      get: {
        summary: 'Lista todos os usuários',
        responses: {
          '200': {
            description: 'Lista de usuários retornada com sucesso.',
          },
        },
      },
    },
    // ... adicione todas as rotas aqui ...
  }
};
// *******************************************************************


// --- Middlewares Globais ---

// Middleware para processar requisições com corpo JSON (necessário para POST/PUT)
app.use(express.json());

// Middleware para processar dados de formulário URL-encoded
app.use(express.urlencoded({ extended: true }));


// --- Montagem das Rotas da Aplicação ---

// Monta as rotas CRUD de Usuários no endpoint /users
app.use('/users', usersRoutes);

// Monta as rotas CRUD de Fornecedores no endpoint /suppliers
app.use('/suppliers', supplierRoutes);

// Monta as rotas da Documentação Swagger no endpoint /api-docs
// A documentação estará acessível em: http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// --- Rota Raiz (Opcional, apenas para testar se o servidor está ativo) ---
app.get('/', (req, res) => {
  res.send('API Central de Compras Ativa! Acesse <a href="/api-docs">/api-docs</a> para a documentação.');
});


// --- Inicialização do Servidor ---

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger em http://localhost:${port}/api-docs`);
});