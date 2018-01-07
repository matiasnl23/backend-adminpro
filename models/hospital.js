// Importación requerida para MongoDB
var mongoose = require('mongoose');

// Definición del Schema
var Schema = mongoose.Schema;

// Modelo del usuario en la base de datos
var hospitalSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'hospitales' });

module.exports = mongoose.model('Hospital', hospitalSchema);