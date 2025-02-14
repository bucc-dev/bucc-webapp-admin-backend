import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BUCC WebApp",
      version: "1.0.0",
      description: "API documentation",
      contact: {
        email: "findtamilore@gmail.com"
      }
    },
    servers: [
      {
        url: "http://127.0.0.1:3000/api/v1",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/docs/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
