// ================================================================
// Configurem PORT de manera dinàmica ( producció i desenvolupanent )
// ================================================================

process.env.PORT = process.env.PORT || 3000;

// ================================================================
// Entorns ( producció i desenvolupament )
// ================================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================================================
// Conexió a la BBDD
// ================================================================


let urlDB;

if (process.env.NODE_ENV = 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://efarinyes:p0hgdgnwiUxTko8i@cluster0-vt95l.mongodb.net/cafe';
}

process.env.URL_DB = urlDB;