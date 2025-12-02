import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bots Automation API',
      version: '1.0.0',
      description: 'API para gerenciamento de bots de automação com BullMQ e Selenium',
      contact: {
        name: 'Bryan',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.API_PORT || 3000}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
    tags: [
      { name: 'Health', description: 'Health check da API' },
      { name: 'Jobs', description: 'Gerenciamento de jobs na fila' },
      { name: 'Executions', description: 'Logs de execução dos bots' },
      { name: 'Selenoid', description: 'Status do Selenoid' },
    ],
  },
  apis: ['./src/api/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

