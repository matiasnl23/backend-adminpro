// Importación requerida para MongoDB
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Definición del Schema
var Schema = mongoose.Schema;

// Roles válidos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

// Modelo del usuario en la base de datos
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El correo electrónico es requerido'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }

});

// En caso de tener varios 'unique' se puede utilizar la clave en el mensaje.
// usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });
usuarioSchema.plugin(uniqueValidator, { message: 'El correo electrónico ya existe' });

module.exports = mongoose.model('Usuario', usuarioSchema);