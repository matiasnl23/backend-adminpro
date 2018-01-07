// Importaciones necesarias
var express = require('express');
var fs = require('fs');

// Instancio express
var app = express();

// Rutas
app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./uploads/${tipo}/${img}`;

    // Verifico si existe la imagen
    fs.exists(path, existe => {

        // Si no existe mando una por defecto
        if (!existe) {
            path = './assets/no-img.jpg';
        }

        // Envío la imagen
        res.sendfile(path);
    });
});

module.exports = app;