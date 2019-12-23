const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuari = require('../models/usuari.model');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;
    Usuari.findOne({ correu: body.correu }, (err, usuariDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuariDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    missatge: '(Usuari) o contrassenya incorrectes'
                }
            });
        }
        if (!bcrypt.compareSync(body.contrassenya, usuariDB.contrassenya)) {
            return res.status(400).json({
                ok: false,
                err: {
                    missatge: 'Usuari o (contrassenya) incorrectes'
                }
            });
        }

        let token = jwt.sign({
            usuari: usuariDB,

        }, process.env.SEED, { expiresIn: process.env.CADUCITAT });

        res.json({
            ok: true,
            usuari: usuariDB,
            token
        });
    });

});


module.exports = app;