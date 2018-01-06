// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexión DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalesDB', (err, res) => {
    // Finalizar con error si no se concreta la conexión con MongoDB
    if (err) throw err;

    console.log('Base de datos: \x1b[1m\x1b[32m%s\x1b[0m', 'Online');
});

// Importación de rutas
var appRoute = require('./routes/app');

// Utilizar las rutas de 'appRoute' al acceder a '/'
app.use('/', appRoute);

// Escuchar peticiones
app.listen(3000, () => {
    // Imprimiendo Online en color verde y brillante
    console.log('Se ha iniciado el servidor en el puerto 3000: \x1b[1m\x1b[32m%s\x1b[0m', 'Online');
});