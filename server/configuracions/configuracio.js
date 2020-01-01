// ================================================================
// Configurem PORT de manera dinàmica ( producció i desenvolupanent )
// ================================================================

process.env.PORT = process.env.PORT || 3000;

// ================================================================
// Entorns ( producció i desenvolupament )
// ================================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ================================================================
// Caducutat del token
// ================================================================
// 60 segons
// 60 minuts
// 24 hores
// 30 dies

process.env.CADUCITAT = 60 * 60 * 24 * 30;

// ================================================================
// SEED d'autentificació
// ================================================================

process.env.SEED = process.env.SEED || 'aquest-es-el-seed-de-desenvolupament';

// ================================================================
// Conexió a la BBDD
// ================================================================


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;

}

process.env.URL_DB = urlDB;

// ================================================================
// Google Client ID
// ================================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '320872394296-o2kqesksm11j8ac4pv4t7pbeqsb3mcjh.apps.googleusercontent.com';