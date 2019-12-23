require('./configuracions/configuracio');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.use(require('./rutas/usuari.rutas'));
// app.use(require('./rutas/login'));

app.use(require('./rutas/index'));

mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {


    if (err) throw err;

    console.log('Base de dades en línia');

});


app.listen(process.env.PORT, () => {
    console.log('Escoltant el port', process.env.PORT);
});