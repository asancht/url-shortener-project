import swaggerJSDoc from "swagger-jsdoc";

//Configuración de opciones de swagger

const swaggerDefinition = {
  openapi: '3.0.0',
    info: {
      title: 'URL Shortener Challenge MELI',
      version: '1.0.0',
      description: 'API para acortar URL y que sea mas simple su publicación en otros sitios : Ejemplo: twitter'
      ,
    
      contact: {
        name: 'Alfonso Sanchez',
        mail: 'mailto:asanchez120@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://ec2-54-211-71-95.compute-1.amazonaws.com:4000',
        description: 'Production server',
      },
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      }
    ],
   };

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['**/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
