var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var producteSchema = new Schema({
    nom: { type: String, required: [true, 'El nom del producte és necessari'] },
    preuUni: { type: Number, required: [true, 'El preu per unitat és necesar'] },
    descripcio: { type: String, required: false },
    imatge: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuari: { type: Schema.Types.ObjectId, ref: 'Usuari' }
});


module.exports = mongoose.model('Producte', producteSchema);