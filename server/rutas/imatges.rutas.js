const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autentificacio');


let app = express();

app.get('/imatge/:tipus/:imatge', verificaTokenImg, (req, res) => {

    let tipus = req.params.tipus;
    let imatge = req.params.imatge;


    let pathImatge = path.resolve(__dirname, `../../uploads/${tipus}/${ imatge }`);

    if (fs.existsSync(pathImatge)) {

        res.sendFile(pathImatge);

    } else {
        let noImatgePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImatgePath);
    }

});
module.exports = app;