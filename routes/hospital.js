// Importaciones necesarias
var express = require('express');

// Middlewares
var mdAutenticacion = require('../middlewares/autenticacion');

// Instancio express
var app = express();

// Obtengo el modelo del hospital
var Hospital = require('../models/hospital');

// ==================================================
// Obtener listado de hospitales
// ==================================================
app.get('/', (req, res, next) => {
    var offset = req.query.offset || 0;
    offset = Number(offset);

    Hospital.find({})
        .skip(offset)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    mensaje: 'Error al tratar de obtener los hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, resultados) => {
                res.status(200).json({
                    error: false,
                    resultados,
                    hospitales
                });
            })
        });
});



// ==================================================
// Crear un nuevo hospital
// ==================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body; // Solo funciona si bodyParser existe

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuarioLogueado._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                error: true,
                mensaje: 'Error al tratar de crear el hospital',
                errors: err
            });
        }

        res.status(201).json({
            error: false,
            hospitalGuardado,
            usuarioLogueado: req.usuarioLogueado
        });
    });
});

// ==================================================
// Actualizar hospital
// ==================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(404).json({
                error: true,
                mensaje: `El hospital con el id ${id} no existe.`,
                errors: { message: 'No existe el hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    mensaje: 'Error al actualizar la información del hospital',
                    errors: err
                });
            }

            res.status(200).json({
                error: false,
                hospitalGuardado,
                usuarioLogueado: req.usuarioLogueado
            });
        });
    });
});

// ==================================================
// Borrar un hospital por ID
// ==================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(404).json({
                error: true,
                mensaje: `El hospital con el id ${id} no existe.`,
                errors: { message: 'No existe el hospital con ese ID' }
            });
        }

        res.status(200).json({
            error: false,
            hospitalBorrado,
            usuarioLogueado: req.usuarioLogueado
        });
    });
});

module.exports = app;