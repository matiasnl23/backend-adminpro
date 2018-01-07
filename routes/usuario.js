// Importaciones necesarias
var express = require('express');

// Instancio express
var app = express();

// Obtengo el modelo del usuario
var Usuario = require('../models/usuario');

// ==================================================
// Obtener listado de usuarios
// ==================================================
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

// ==================================================
// Crear un nuevo usuario
// ==================================================
app.post('/', (req, res) => {
    var body = req.body; // Solo funciona si bodyParser existe

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                error: true,
                mensaje: 'Error al tratar de crear el usuario',
                errors: err
            });
        }

        res.status(201).json({
            error: false,
            usuario: usuarioGuardado
        });
    });
});

module.exports = app;