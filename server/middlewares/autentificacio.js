const jwt = require('jsonwebtoken');



// ============================
// Verificar Token
// ============================

let verificaToken = (req, res, next) => {
    let token = req.get('token');


    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    missatge: 'Token no vàlid'
                }
            });
        }
        req.usuari = decoded.usuari;

        next();
    });

};

// ============================
// Verificar Rol
// ============================

let verificaRol = (req, res, next) => {
    let usuari = req.usuari;

    if (usuari.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                missatge: 'No tens permisos per fer això'
            }
        });
    }
};

// ============================
// Verificar token per URL
// ============================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    missatge: 'Token no vàlid'
                }
            });
        }
        req.usuari = decoded.usuari;

        next();
    });
};

module.exports = {
    verificaToken,
    verificaRol,
    verificaTokenImg
};