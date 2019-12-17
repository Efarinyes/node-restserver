const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuari = require('../models/usuari.model');

const app = express();

// Peticions GET - POST - PUT - DELETE

app.get('/usuari', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuari.find({ estat: true }, 'nom correu imatge role estat google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuaris) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuari.countDocuments({ estat: true }, (err, totalRegistres) => {
                res.json({
                    ok: true,
                    totalRegistres,
                    usuaris

                });


            });
        });

});

app.post('/usuari', function(req, res) {
    let body = req.body;

    let usuari = new Usuari({
        nom: body.nom,
        correu: body.correu,
        contrassenya: bcrypt.hashSync(body.contrassenya, 10),
        role: body.role
    });

    usuari.save((err, usuariDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuar: usuariDB
        });
    });
});

app.put('/usuari/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nom', 'correu', 'imatge', 'role', 'estat']);



    Usuari.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuariDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuari: usuariDB
        });
    });
});

app.delete('/usuari/:id', function(req, res) {

    let id = req.params.id;
    //  Usuari.findByIdAndRemove(id, (err, usuariBorrat) => {

    let modificaEstat = {
        estat: false
    };

    Usuari.findByIdAndUpdate(id, modificaEstat, { new: true }, (err, usuariBorrat) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuariBorrat) {
            return res.status(400).json({
                ok: false,
                err: {
                    missatge: 'Usuari no existeix'
                }
            });
        }
        res.json({
            ok: true,
            usuari: usuariBorrat
        });

    });


});

module.exports = app;