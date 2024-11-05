const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tholde REST API Documentation",
      version: "1.0.0",
      description: "API for user management and authentication",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/api/*.ts"],
};

export default swaggerOptions;
