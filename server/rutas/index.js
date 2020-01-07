const express = require('express');
const app = express();

app.use(require('./usuari.rutas'));
app.use(require('./login'));
app.use(require('./categoria.rutas'));
app.use(require('./producte.rutas'));



module.exports = app;