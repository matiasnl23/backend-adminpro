// Importación requerida para MongoDB
var mongoose = require('mongoose');

// Definición del Schema
var Schema = mongoose.Schema;

// Modelo del usuario en la base de datos
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El correo electrónico es requerido'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' }

});

module.exports = mongoose.model('Usuario', usuarioSchema);