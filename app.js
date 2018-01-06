// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexión DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalesDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[1m\x1b[32m%s\x1b[0m', 'Online');
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        error: false,
        mensaje: 'Petición realizada correctamente'
    });
});

app.get('/404', (req, res, next) => {
    res.status(404).json({
        error: true,
        mensaje: 'Página no encontrada'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    // Imprimiendo Online en color verde y brillante
    console.log('Se ha iniciado el servidor en el puerto 3000: \x1b[1m\x1b[32m%s\x1b[0m', 'Online');
});