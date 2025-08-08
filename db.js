const { Pool } = require('pg');
require('dotenv').config();

const isRender = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRender ? { rejectUnauthorized: false } : false
});

// Test connexion au démarrage
(async () => {
  try {
    await pool.connect();
    console.log('✅ Connexion à la base PostgreSQL réussie.');
  } catch (err) {
    console.error('❌ Erreur de connexion PostgreSQL:', err);
  }
})();

module.exports = pool;
