// Importaciones necesarias
var express = require('express');

// Instancio express
var app = express();

// Obtengo el modelo del usuario
var Usuario = require('../models/usuario');

// Rutas
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al tratar de obtener los usuarios',
                errors: err
            });
        }

        res.status(200).json({
            error: false,
            usuarios
        });
    });
});

module.exports = app;