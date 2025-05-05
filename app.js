require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/mongo');

// Rutas
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Práctica Final API",
        version: "1.0.0",
        description: "Documentación de la API para gestión de usuarios, clientes, proyectos y albaranes."
      },
      servers: [
        { url: "http://localhost:3000", description: "Servidor local" }
      ]
    },
    // Aquí indicamos dónde buscar comentarios JSDoc
    apis: ["./routes/*.js", "./controllers/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Ruta de documentación

// Comenzar el server
/* app.listen(process.env.PORT, () => {
    console.log('Servidor escuchando en el puerto 3000');
}); */

dbConnect();

app.use('/api/auth', authRoutes); // Rutas de autentificación
app.use('/api/company', companyRoutes); // Rutas de empresa
app.use("/api/client", require("./routes/clients")); // Rutas de clientes
app.use("/api/project", require("./routes/projects")); // Rutas de proyectos
app.use("/api/deliverynote", require("./routes/deliverynotes")); // Rutas de albaranes

app.use((req, res, next) => {
    console.log("Cuerpo de la solicitud:", req.body); // Verifica qué se está recibiendo
    next();
});

module.exports = app;