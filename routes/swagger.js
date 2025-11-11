const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Central de Compras',
      version: '1.0.0',
      description: 'Documentação da API REST da Central de Compras (Desenvolvimento de Aplicações II)',
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'equipe@centralcompras.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    tags: [
      { 
        name: 'Usuários', 
        description: 'Rotas de gerenciamento de usuários - Karen Suelen da Silva' 
      },
      { 
        name: 'Fornecedores', 
        description: 'Rotas de gerenciamento de fornecedores - Karen Suelen da Silva' 
      },
      { 
        name: 'Lojas', 
        description: 'Rotas de gerenciamento de lojas - Bryan Gonçalves Pereira' 
      },
      { 
        name: 'Produtos', 
        description: 'Rotas de gerenciamento de produtos - Bryan Gonçalves Pereira' 
      },
      { 
        name: 'Pedidos', 
        description: 'Rotas de gerenciamento de pedidos - Davi Mendes' 
      },
      { 
        name: 'Campanhas', 
        description: 'Rotas de gerenciamento de campanhas' 
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            details: {
              type: 'string',
              description: 'Detalhes do erro'
            }
          }
        }
      }
    }
  },
  // Caminho absoluto para os arquivos de rotas
  apis: [path.join(__dirname, './routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;