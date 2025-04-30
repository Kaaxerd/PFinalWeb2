require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/mongo');
//const bodyParser = require('body-parser');

// Rutas
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');

const app = express();

app.use(express.json());
//app.use(bodyParser.json());

app.use('/api/auth', authRoutes); // Rutas de autentificación
app.use('/api/company', companyRoutes); // Rutas de empresa

// Comenzar el server
app.listen(process.env.PORT, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

dbConnect();

app.use((req, res, next) => {
    console.log("Cuerpo de la solicitud:", req.body); // Verifica qué se está recibiendo
    next();
});