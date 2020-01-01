const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuarcions de Google singIn

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);

    return {
        nom: payload.name,
        correu: payload.email,
        imatge: payload.picture,
        google: true
    };

}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuari.findOne({ correu: googleUser.correu }, (err, usuariDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuariDB) {

            if (usuariDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usar autentificació normal. Usuari ja registrat'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuari: usuariDB,

                }, process.env.SEED, { expiresIn: process.env.CADUCITAT });

                return res.json({
                    ok: true,
                    usuari: usuariDB,
                    token
                });
            }
        } else {
            // Crea l'usuari a la BBDD amb credencials de Google
            let usuari = new Usuari();

            usuari.nom = googleUser.nom;
            usuari.correu = googleUser.correu;
            usuari.imatge = googleUser.imatge;
            usuari.google = true;
            usuari.contrassenya = ':)';

            usuari.save((err, usuariDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
            });
        }
        let token = jwt.sign({
            usuari: usuariDB,

        }, process.env.SEED, { expiresIn: process.env.CADUCITAT });

        return res.json({
            ok: true,
            usuari: usuariDB,
            token
        });

    });
});


module.exports = app;