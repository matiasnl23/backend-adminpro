// Importaciones necesarias
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var GoogleAuth = require('google-auth-library');

// Instancio 
var app = express();
var auth = new GoogleAuth;

// Obtengo el SEED
const SEED = require('../config/config').SEED;
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

// Obtengo el modelo del usuario
var Usuario = require('../models/usuario');

// ==================================================
// Autenticación con google
// ==================================================
app.post('/google', (req, res) => {

    var token = req.body.token || 'tokenvacio';

    var client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(err, login) {

            if (err) {
                return res.status(400).json({
                    error: true,
                    mensaje: 'Token no válido',
                    errors: err
                });
            }
            var payload = login.getPayload();
            var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];

            Usuario.findOne({ email: payload.email }, (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: 'Error al buscar usuario',
                        errors: err
                    });
                }

                if (usuario) {
                    if (usuario.google === false) {
                        return res.status(400).json({
                            error: true,
                            mensaje: 'Debe realizar la autenticación con el método normal'
                        })
                    } else {
                        // Elimino la contraseña de la respuesta
                        usuario.password = undefined;

                        // Creación del TOKEN
                        var token = jwt.sign({ usuario }, SEED, { expiresIn: 14400 });

                        res.status(200).json({
                            error: false,
                            usuario,
                            token: token,
                            id: usuario._id
                        });
                    }
                } else {
                    var usuario = new Usuario();
                    usuario.nombre = payload.name;
                    usuario.email = payload.email;
                    usuario.password = 'GOOGLE_ACCOUNT';
                    usuario.img = payload.picture;
                    usuario.google = true;

                    usuario.save((err, usuarioDB) => {
                        if (err) {
                            return res.status(500).json({
                                error: true,
                                mensaje: 'Error al crear usuario de Google',
                                errors: err
                            });
                        }

                        // Elimino la contraseña de la respuesta
                        usuario.password = undefined;

                        // Creación del TOKEN
                        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                        res.status(200).json({
                            error: false,
                            usuario: usuarioDB,
                            token: token,
                            id: usuario._id
                        });
                    });
                }
            });


        });
});

// ==================================================
// Autenticación interna
// ==================================================
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

        // Elimino la contraseña de la respuesta
        usuarioExistente.password = undefined;

        // Creación del TOKEN
        var token = jwt.sign({ usuario: usuarioExistente }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            error: false,
            usuario: usuarioExistente,
            token: token,
            id: usuarioExistente._id
        });
    });
});

module.exports = app;