// Importaciones necesarias
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// Instancio express
var app = express();

// Importo modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Implementando el middleware
app.use(fileUpload());

// ==================================================
// Carga de archivos a todas las colecciones (imágen)
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

    subirArchivoPorTipo(tipo, id, archivo, path, nombreArchivo, res);

});

function subirArchivoPorTipo(tipo, id, archivo, path, nombreArchivo, res) {
    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: 'Error al obtener el usuario',
                        errors: err
                    });
                }

                if (!usuario) {
                    return res.status(404).json({
                        error: true,
                        mensaje: `No se encontró al usuario con el id: ${ id }`,
                        errors: { message: 'El usuario no existe' }
                    });
                }

                // Guardo el archivo
                archivo.mv(path, err => {
                    if (err) {
                        return res.status(500).json({
                            error: true,
                            mensaje: 'Error al mover el archivo',
                            errors: err
                        });
                    }

                    // Verifico si ya existía una imagen y la elimino
                    if (usuario.img) {
                        let img = './uploads/usuarios/' + usuario.img;
                        if (fs.existsSync(img)) {
                            fs.unlink(img);
                        }
                    }

                    // Actualizo la información en la base de datos del usuario
                    usuario.img = nombreArchivo;
                    usuario.save((err, usuarioActualizado) => {
                        usuarioActualizado.password = undefined;

                        res.status(200).json({
                            error: false,
                            mensaje: 'Imagen del usuario actualizada',
                            usuarioActualizado
                        });
                    });
                });
            });
            break;

        case 'medicos':
            Medico.findById(id, (err, medico) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: 'Error al obtener el médico',
                        errors: err
                    });
                }

                if (!medico) {
                    return res.status(404).json({
                        error: true,
                        mensaje: `No se encontró al médico con el id: ${ id }`,
                        errors: { message: 'El médico no existe' }
                    });
                }

                // Guardo el archivo
                archivo.mv(path, err => {
                    if (err) {
                        return res.status(500).json({
                            error: true,
                            mensaje: 'Error al mover el archivo',
                            errors: err
                        });
                    }
                    // Verifico si ya existía una imagen y la elimino
                    if (medico.img) {
                        let img = './uploads/medicos/' + medico.img;
                        if (fs.existsSync(img)) {
                            fs.unlink(img);
                        }
                    }

                    // Actualizo la información en la base de datos del médico
                    medico.img = nombreArchivo;
                    medico.save((err, medicoActualizado) => {
                        res.status(200).json({
                            error: false,
                            mensaje: 'Imagen del médico actualizada',
                            medicoActualizado
                        });
                    });
                });
            });
            break;

        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: 'Error al obtener el hospital',
                        errors: err
                    });
                }

                if (!hospital) {
                    return res.status(404).json({
                        error: true,
                        mensaje: `No se encontró al hospital con el id: ${ id }`,
                        errors: { message: 'El hospital no existe' }
                    });
                }

                // Guardo el archivo
                archivo.mv(path, err => {
                    if (err) {
                        return res.status(500).json({
                            error: true,
                            mensaje: 'Error al mover el archivo',
                            errors: err
                        });
                    }
                    // Verifico si ya existía una imagen y la elimino
                    if (hospital.img) {
                        let img = './uploads/hospitales/' + hospital.img;
                        if (fs.existsSync(img)) {
                            fs.unlink(img);
                        }
                    }

                    // Actualizo la información en la base de datos del hospital
                    hospital.img = nombreArchivo;
                    hospital.save((err, hospitalActualizado) => {
                        res.status(200).json({
                            error: false,
                            mensaje: 'Imagen del hospital actualizada',
                            hospitalActualizado
                        });
                    });
                });
            });
            break;

        default:
            break;
    }
}

module.exports = app;