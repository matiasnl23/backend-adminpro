// Importaciones necesarias
var express = require('express');
var fileUpload = require('express-fileupload');

// Instancio express
var app = express();

// Implementando el middleware
app.use(fileUpload());

// ==================================================
// 
// ==================================================
app.put('/:tipo/:id', (req, res, next) => {

    // Obtengo tipo ('usuario', 'medico', 'hospital') y el ID del 'tipo'
    var tipo = req.params.tipo;
    var id = req.params.id;

    // Valido que el 'tipo' sea uno de los permitidos
    var tiposValidos = ['usuario', 'medico', 'hospital'];
    if (!tiposValidos.indexOf(tipo)) {
        return res.status(400).json({
            error: true,
            mensaje: `La coleccion ${ tipo } no existe`,
            errors: { message: 'Debe seleccionar una coleccion existente: ' + tiposValidos.join(', ') }
        })
    }

    // Si no se ha adjuntado ningún archivo
    if (!req.files) {
        return res.status(400).json({
            error: true,
            mensaje: 'Falta el archivo adjunto',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.img;
    var archivoArray = archivo.name.split('.');
    var extension = archivoArray[archivoArray.length - 1];

    // Extenciones válidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            error: true,
            mensaje: 'El archivo adjunto no tiene una extensión permitida',
            errors: { message: 'Debe seleccionar una imagen. Formatos permitidos: ' + extensionesValidas.join(', ') }
        });
    }

    // Renombrar el archivo (usuario._id + random + .ext)
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;
    // Almacenar el archivo
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }
        res.status(200).json({
            error: false,
            mensaje: 'Petición realizada correctamente',
            extension
        });
    });
});

module.exports = app;