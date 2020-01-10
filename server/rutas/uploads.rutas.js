const express = require('express');
const fileUpload = require('express-fileupload');

let app = express();

const Usuari = require('../models/usuari.model');
const Producte = require('../models/producte.model');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipus/:id', (req, res) => {

    let id = req.params.id;
    let tipus = req.params.tipus;


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                missatge: 'Cap arxiu seleccionat'
            }
        });
    }
    // tipus vàlids

    let tipusValids = ['usuaris', 'productes'];

    if (tipusValids.indexOf(tipus) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                missatge: 'Els tipus vàlids son ' + tipusValids.join(', ')
            }
        });
    }



    let arxiu = req.files.arxiu;

    let nomArxiu = arxiu.name.split('.');
    let extensio = nomArxiu[nomArxiu.length - 1];

    // Extensions permeses per pujar arxius 
    let extensionsValides = ['jpg', 'png', 'gif', 'jpeg', 'pdf'];

    if (extensionsValides.indexOf(extensio) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                missatge: 'Les extensions permeses són: ' + extensionsValides.join(', '),
                ext: extensio
            }
        });
    }

    // Cambiar nom arxiu ( personalitzat i únic)

    let nouArxiu = `${id}-${new Date().getMilliseconds()}.${extensio}`;


    arxiu.mv(`uploads/${tipus}/${nouArxiu}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipus === 'usuaris') {
            imatgeUsuari(id, res, nouArxiu);
        } else {
            imatgeProducte(id, res, nouArxiu);
        }

    });
});



function imatgeUsuari(id, res, nouArxiu) {

    Usuari.findById(id, (err, usuariDB) => {
        if (err) {
            borrarArxiu(nouArxiu, 'usuaris');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuariDB) {
            borrarArxiu(nouArxiu, 'usuaris');
            return res.status(400).json({
                ok: false,
                err: {
                    missatge: 'Usuari no existeix'
                }
            });
        }
        borrarArxiu(usuariDB.imatge, 'usuaris');

        usuariDB.imatge = nouArxiu;
        usuariDB.save((err, usuariGuardat) => {

            res.json({
                ok: true,
                usuari: usuariGuardat,
                imatge: nouArxiu
            });

        });
    });
}

function imatgeProducte(id, res, nouArxiu) {
    Producte.findById(id, (err, producteDB) => {
        if (err) {
            borrarArxiu(nouArxiu, 'productes');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producteDB) {
            borrarArxiu(nouArxiu, 'productes');
            return res.status(400).json({
                ok: false,
                err: {
                    missatge: 'Producte no existeix'
                }
            });
        }
        borrarArxiu(producteDB.imatge, 'productes');

        producteDB.imatge = nouArxiu;
        producteDB.save((err, producteDB) => {

            res.json({
                ok: true,
                producte: producteDB,
                imatge: nouArxiu
            });

        });
    });

}

function borrarArxiu(nomArxiu, tipus) {

    let pathImatge = path.resolve(__dirname, `../../uploads/${tipus}/${ nomArxiu }`);

    if (fs.existsSync(pathImatge)) {
        fs.unlinkSync(pathImatge);
    }
}

module.exports = app;