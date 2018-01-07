// Importaciones necesarias
var express = require('express');

// Instancio express
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ==================================================
// Búsqueda general
// ==================================================
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
});

// ==================================================
// Búsqueda por tabla
// ==================================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    busqueda = new RegExp(busqueda, 'i');

    var promesa;
    switch (tabla) {
        case 'hospitales':
            promesa = buscarHopitales(busqueda)
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda)
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda)
            break;

        default:
            return res.status(400).json({
                error: true,
                mensaje: 'El parámetro de búsqueda no es correcto'
            })
            break;
    }

    promesa.then(datos => {
        res.status(200).json({
            error: false,
            [tabla]: datos
        });
    });
});

// ==================================================
// Funciones que retornan promesas
// ==================================================

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