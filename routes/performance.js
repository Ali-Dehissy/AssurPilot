const express = require('express');
const router = express.Router();
const db = require('../db');

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/ca/vie', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        SUM(CASE WHEN date_creation_client::date = CURRENT_DATE THEN prime ELSE 0 END) AS ca_aujourdhui,
        SUM(CASE WHEN date_creation_client >= date_trunc('week', CURRENT_DATE) THEN prime ELSE 0 END) AS ca_semaine,
        SUM(CASE WHEN date_creation_client >= date_trunc('month', CURRENT_DATE) THEN prime ELSE 0 END) AS ca_mois,
        SUM(CASE WHEN date_creation_client >= date_trunc('year', CURRENT_DATE) THEN prime ELSE 0 END) AS ca_annee
      FROM souscription_vie;
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

router.get('/ca/auto', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        SUM(CASE WHEN date_creation_client::date = CURRENT_DATE THEN prime ELSE 0 END) AS ca_aujourdhui,
        SUM(CASE WHEN date_creation_client >= date_trunc('week', CURRENT_DATE) THEN prime ELSE 0 END) AS ca_semaine,
        SUM(CASE WHEN date_creation_client >= date_trunc('month', CURRENT_DATE) THEN prime ELSE 0 END) AS ca_mois,
        SUM(CASE WHEN date_creation_client >= date_trunc('year', CURRENT_DATE) THEN prime ELSE 0 END) AS ca_annee
      FROM souscription_auto
      WHERE id_agent = 1;
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
