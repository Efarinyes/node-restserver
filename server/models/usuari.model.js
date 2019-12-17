const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useCreateIndex', true);

let rolsValids = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un Rol vàlid'
};

let Schema = mongoose.Schema;

let usuariSchema = new Schema({
    nom: {
        type: String,
        required: [true, 'El nom es necessari']
    },
    correu: {
        type: String,
        unique: true,
        required: [true, 'Necessari el correu electrònic']
    },
    contrassenya: {
        type: String,
        required: [true, 'Contrassenya necessària']
    },
    imatge: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolsValids
    },
    estat: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuariSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.contrassenya;
    return userObject;
};

usuariSchema.plugin(uniqueValidator, { message: '{PATH} ha de ser únic' });

module.exports = mongoose.model('Usuari', usuariSchema);