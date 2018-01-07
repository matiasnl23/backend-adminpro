// Importaciones necesarias
var express = require('express');

// Middlewares
var mdAutenticacion = require('../middlewares/autenticacion');

// Instancio express
var app = express();

// Obtengo el modelo del médico
var Medico = require('../models/medico');

// ==================================================
// Obtener listado de los médicos
// ==================================================
app.get('/', (req, res, next) => {
    Medico.find({}, (err, medicos) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al tratar de obtener los médicos',
                errors: err
            });
        }

        res.status(200).json({
            error: false,
            medicos
        });
    });
});



// ==================================================
// Crear un nuevo médico
// ==================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body; // Solo funciona si bodyParser existe

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuarioLogueado._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                error: true,
                mensaje: 'Error al tratar de crear el médico',
                errors: err
            });
        }

        res.status(201).json({
            error: false,
            medicoGuardado,
            usuarioLogueado: req.usuarioLogueado
        });
    });
});

// ==================================================
// Actualizar médico
// ==================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al buscar el médico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(404).json({
                error: true,
                mensaje: `El médico con el id ${id} no existe.`,
                errors: { message: 'No existe el médico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    mensaje: 'Error al actualizar la información del médico',
                    errors: err
                });
            }

            res.status(200).json({
                error: false,
                medicoGuardado,
                usuarioLogueado: req.usuarioLogueado
            });
        });
    });
});

// ==================================================
// Borrar un médico por ID
// ==================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al borrar el médico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(404).json({
                error: true,
                mensaje: `El médico con el id ${id} no existe.`,
                errors: { message: 'No existe el médico con ese ID' }
            });
        }

        res.status(200).json({
            error: false,
            medicoBorrado,
            usuarioLogueado: req.usuarioLogueado
        });
    });
});

module.exports = app;