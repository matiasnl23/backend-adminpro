// Importaciones necesarias
var jwt = require('jsonwebtoken');

// Obtengo el SEED
var SEED = require('../config/config').SEED;

// ==================================================
// Verificación del token (FORMA CORRECTA)
// ==================================================
exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                error: true,
                mensaje: 'Error al verificar el token',
                errors: err
            });
        }

        req.usuarioLogueado = decoded.usuario;

        next();
    });
}