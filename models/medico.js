// Importación requerida para MongoDB
var mongoose = require('mongoose');

// Definición del Schema
var Schema = mongoose.Schema;

// Modelo del médico en la base de datos
var medicoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El ID del hospital es un campo obligatorio'] }

});

module.exports = mongoose.model('Medico', medicoSchema);