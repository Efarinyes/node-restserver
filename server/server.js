require('./configuracions/configuracio');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Peticions GET - POST - PUT - DELETE

app.get('/usuari', function(req, res) {
    res.json('Get Usuari');
});

app.post('/usuari', function(req, res) {

    let body = req.body;
    if (body.nom === undefined) {
        res.status(400).json({
            ok: false,
            missatge: 'El nom es argument necessari'
        });
    } else {
        res.json({
            body
        });
    }

});

app.put('/usuari/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    });
});

app.delete('/usuari', function(req, res) {
    res.json('Delete Usuari');
});

app.listen(process.env.PORT, () => {
    console.log('Escoltant el port', process.env.PORT);
});