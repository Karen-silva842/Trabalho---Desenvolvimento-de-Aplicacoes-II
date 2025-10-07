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
      { name: 'Usuários', description: 'Rotas gerenciamento de usuários - Karen Suélen da Silva' },
      { name: 'Fornecedores', description: 'Rotas gerenciamento de fornecedores - Karen Suélen da Silva' },
      { name: 'Lojas', description: 'Rotas gerenciamento de lojas - Bryan Gonçalves Pereira' },
      { name: 'Produtos', description: 'Rotas gerenciamento de produtos - Bryan Gonçalves Pereira' },
      { name: 'Pedidos', description: 'Rotas gerenciamento de Pedidos - Davi Mendes' },
      { name: 'Campanhas', description: 'Rotas gerenciamento de Campanhas - Davi Mendes' },
    ],
  },
  apis: ['./routes/**/*.js'], // Corrigido para buscar arquivos em subpastas também
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
