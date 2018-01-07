// Importaciones necesarias
var express = require('express');
var bcrypt = require('bcryptjs');

// Instancio express
var app = express();

// Obtengo el modelo del usuario
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioExistente) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al tratar de obtener el usuario',
                errors: err
            });
        }

        if (!usuarioExistente) {
            return res.status(400).json({
                error: true,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioExistente.password)) {
            return res.status(400).json({
                error: true,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Futura creación del token

        usuarioExistente.password = undefined;

        res.status(200).json({
            error: false,
            usuario: usuarioExistente,
            id: usuarioExistente._id
        });
    });
});

module.exports = app;