const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Central de Compras',
      version: '1.0.0',
      description: 'Documentação da API REST da Central de Compras (Desenvolvimento de Aplicações II)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    tags: [
      { name: 'Usuários', description: 'Rotas para gerenciamento de usuários' },
      { name: 'Fornecedores', description: 'Rotas para gerenciamento de fornecedores' },
      { name: 'Lojas', description: 'Rotas para gerenciamento de lojas' },
      { name: 'Produtos', description: 'Rotas para gerenciamento de produtos' },
      { name: 'Pedidos', description: 'Rotas para gerenciamento de pedidos' },
      { name: 'Campanhas', description: 'Rotas para campanhas promocionais' },
    ],
  },
  apis: ['./routes/*.js'], // O Swagger vai ler TODAS as anotações @swagger das rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
