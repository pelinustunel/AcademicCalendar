const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Academic Calendar API",
      version: "1.0.0",
      description: "API documentation for Academic Calendar Management System",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
            isActive: { type: "boolean" },
            role: { type: "string", enum: ["admin"] },
          },
        },
        Calendar: {
          type: "object",
          properties: {
            name: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            createdBy: { type: "string" },
          },
        },
        Event: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            calendar: { type: "string" },
            createdBy: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./docs/routes/*.yml"],
};

module.exports = swaggerJsdoc(options);
