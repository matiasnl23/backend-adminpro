// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body parser
// parse applitation/x-www-form-urlencoded, segunda línea: 'parse application/json'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalesDB', (err, res) => {
    // Finalizar con error si no se concreta la conexión con MongoDB
    if (err) throw err;

    console.log('Base de datos: \x1b[1m\x1b[32m%s\x1b[0m', 'Online');
});

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Importación de rutas
var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenRoutes = require('./routes/imagen');

// Utilizar las rutas de 'appRoute' al acceder a '/'
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagen', imagenRoutes);

app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    // Imprimiendo Online en color verde y brillante
    console.log('Se ha iniciado el servidor en el puerto 3000: \x1b[1m\x1b[32m%s\x1b[0m', 'Online');
});