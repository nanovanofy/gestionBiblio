const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Configuration pour XAMPP
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bibliotheque',
    port: process.env.DB_PORT || 3306,
    // Pour Linux XAMPP
    socketPath: process.env.DB_SOCKET_PATH || '/opt/lampp/var/mysql/mysql.sock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tester la connexion
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL:', err.message);
        console.log('💡 Vérifiez que XAMPP est démarré');
        console.log('📌 Commande: sudo /opt/lampp/lampp start');
        return;
    }
    console.log('✅ Connecté à MySQL via XAMPP avec succès !');
    connection.release();
});

module.exports = pool.promise();
