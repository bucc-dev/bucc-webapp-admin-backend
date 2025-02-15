import swaggerJsdoc from "swagger-jsdoc";
import m2s from "mongoose-to-swagger";
import Announcement from "../models/announcements";
import User from "../models/users";
import Permission from "../models/permissions";

const swaggerSchemas = {
  User: m2s(User),
  Announcement: m2s(Announcement),
  Permission: m2s(Permission),
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BUCC WebApp",
      version: "1.0.0",
      description: `
API documentation

**Extra Notes:**
- There's no need to manually set and authorize as the tokens are cookies so the browser receives and sends automatically
- View the external doc/README for valid resources, scopes and actions.
      `,
      contact: {
        name: "Contact the Developer: linkedIn",
        url: "https://www.linkedin.com/in/tami-cp0"
      }
    },

    externalDocs: {
      description: "README for developer information",
      url: "https://github.com/bucc-dev/bucc-webapp-admin-backend"
    },
    servers: [
      {
        url: "http://127.0.0.1:3000/api/v1",
        description: "Local server",
      },
    ],
    components: {
      schemas: swaggerSchemas,
    },
  },
  apis: ["./src/docs/**/*.ts"],
};



const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
