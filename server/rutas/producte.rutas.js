const express = require('express');

const { verificaToken } = require('../middlewares/autentificacio');

let app = express();
let Producte = require('../models/producte.model');

// ==========================
// Obtenir tots el productes
// ==========================

app.get('/productes', verificaToken, (req, res) => {
    // llista tots els productes
    // refenciats per usuari i categoria (populate)
    // paginat

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producte.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuari', 'correu')
        .populate('categoria', 'nom')
        .exec((err, productes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productes
            });
        });
});

// ==========================
// Obtenir producte per ID
// ==========================

app.get('/productes/:id', (req, res) => {

    // refenciats per usuari i categoria (populate)

    let id = req.params.id;

    Producte.findById(id)
        .populate('usuari', 'nom correu')
        .populate('categoria', 'nom')
        .exec((err, producteDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!producteDB) {
                return res.json({
                    ok: false,
                    err: {
                        missatge: 'No existeix cap producte amb aquest ID'
                    }
                });
            }
            res.json({
                ok: true,
                producte: producteDB
            });
        });




});

// =============================
// Cercar producte per parametre
// =============================
app.get('/productes/cercar/:terme', verificaToken, (req, res) => {

    let terme = req.params.terme;

    let regexp = new RegExp(terme, 'i')

    Producte.find({ nom: regexp })
        .populate('categoria', 'nom')
        .exec((err, productes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productes) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        missatge: 'No existeix cap producte amb els termes de cerca'
                    }
                });
            }
            res.json({
                ok: true,
                productes
            });
        });
})


// ==========================
// Crear un producte nou
// ==========================

app.post('/productes', verificaToken, (req, res) => {

    // Grabar usuari
    // Grabar categoria a la que pertany (llistat categories)
    let body = req.body;

    let producte = new Producte({
        usuari: req.usuari._id,
        nom: body.nom,
        preuUni: body.preuUni,
        descripcio: body.descripcio,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producte.save((err, producteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producte: producteDB
        });
    });

});

// ==========================
// Actualitzar producte
// ==========================

app.put('/productes/:id', verificaToken, (req, res) => {

    // Grabar usuari
    // Grabar categoria a la que pertany (llistat categories)

    let id = req.params.id;
    let body = req.body;

    Producte.findById(id, (err, producteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producteDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    missatge: 'No hi ha productes amb aquest ID',
                    err
                }
            });
        }
        producteDB.nom = body.nom;
        producteDB.preuUni = body.preuUni;
        producteDB.categoria = body.categoria;
        producteDB.disponible = body.disponible;
        producteDB.descripcio = body.descripcio;

        producteDB.save((err, producteModificat) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producte: producteModificat
            });
        });

    });
});

// ==========================
// Borrar producte
// ==========================

app.delete('/productes/:id', (req, res) => {

    // Grabar usuari
    // Grabar categoria a la que pertany (llistat categories)

    let id = req.params.id;

    Producte.findById(id, (err, producteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producteDB) {
            return res.json({
                ok: false,
                err: {
                    missatge: 'El producte no existeix'
                }
            });
        }
        producteDB.disponible = false;

        producteDB.save((err, producteEliminat) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producte: producteEliminat,
                missatge: 'Producte eliminat'
            });
        });
    });

});









module.exports = app;