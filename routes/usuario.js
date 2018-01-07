// Importaciones necesarias
var express = require('express');
var bcrypt = require('bcryptjs');

// Middlewares
var mdAutenticacion = require('../middlewares/autenticacion');

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
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body; // Solo funciona si bodyParser existe

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
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
            usuarioGuardado,
            usuarioLogueado: req.usuarioLogueado
        });
    });
});

// ==================================================
// Actualizar usuario
// ==================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(404).json({
                error: true,
                mensaje: `El usuario con el id ${id} no existe.`,
                errors: { message: 'No existe el usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    mensaje: 'Error al actualizar la información del usuario',
                    errors: err
                });
            }

            // Oculto el password en la respuesta
            usuarioGuardado.password = undefined;

            res.status(200).json({
                error: false,
                usuarioGuardado,
                usuarioLogueado: req.usuarioLogueado
            });
        });
    });
});

// ==================================================
// Borrar un usuario por ID
// ==================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(404).json({
                error: true,
                mensaje: `El usuario con el id ${id} no existe.`,
                errors: { message: 'No existe el usuario con ese ID' }
            });
        }

        res.status(200).json({
            error: false,
            usuarioBorrado,
            usuarioLogueado: req.usuarioLogueado
        });
    });
});

module.exports = app;