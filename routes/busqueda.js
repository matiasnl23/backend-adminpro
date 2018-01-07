// Importaciones necesarias
var express = require('express');

// Instancio express
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Rutas
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    busqueda = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHopitales(busqueda),
        buscarMedicos(busqueda),
        buscarUsuarios(busqueda)
    ]).then(respuestas => {
        res.status(200).json({
            error: false,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });

    // buscarHopitales(busqueda).then(hospitales => {
    //     res.status(200).json({
    //         error: false,
    //         hospitales
    //     });
    // });
});

function buscarHopitales(busqueda) {
    return new Promise((resolve, reject) => {

        Hospital
            .find({ nombre: busqueda })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda) {
    return new Promise((resolve, reject) => {

        Medico
            .find({ nombre: busqueda })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar médicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda) {
    return new Promise((resolve, reject) => {

        Usuario
            .find({}, 'nombre email role img')
            .or([{ 'nombre': busqueda }, { 'email': busqueda }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;