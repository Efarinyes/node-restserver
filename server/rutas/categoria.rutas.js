const express = require('express');

let { verificaToken, verificaRol } = require('../middlewares/autentificacio');

let app = express();

let Categoria = require('../models/categoria.model');


// ==========================
// Mostra totes le categories
// ==========================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcio')
        .populate('usuari', 'nom correu')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });

});

// ===============================
// Mostra una categoria pel seu id
// ===============================

app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById( ... )

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    missatge: 'La caegoria no existeix'
                }

            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ===================
// Crear una categoria
// ===================

app.post('/categoria', verificaToken, (req, res) => {

    // Retorna la nova categoria
    // Retorna l'usuari que crea la categoria. req.usuari,_id

    let body = req.body;
    let categoria = new Categoria({
        descripcio: body.descripcio,
        usuari: req.usuari._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });



});
// ===================
// Modificar una categoria
// ===================

app.put('/categoria/:id', verificaToken, (req, res) => {

    // modifica una categoria
    // Retorna l'usuari que crea la categoria. req.usuari,_id

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcio: body.descripcio
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ===================
// Modificar una categoria
// ===================

app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {

    // Borra una categoria
    // Retorna l'usuari que crea la categoria. req.usuari,_id

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    missatge: 'Categoria no existeix'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
            missatge: 'Categoria borrada'
        });
    });

});










module.exports = app;