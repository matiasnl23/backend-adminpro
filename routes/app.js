// Importaciones necesarias
var express = require('express');

// Instancio express
var app = express();

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

module.exports = app;