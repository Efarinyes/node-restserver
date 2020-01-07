const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcio: {
        type: String,
        unique: true,
        required: [true, 'La descripcio és necessària']
    },
    usuari: { type: Schema.Types.ObjectId, ref: 'Usuari' }
});

module.exports = mongoose.model('Categoria', categoriaSchema);