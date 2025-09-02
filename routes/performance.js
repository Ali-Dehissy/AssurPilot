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

// === CA Auto ===
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

router.get("/ca", async (req, res) => {
  try {
    const autoJour = await db.query(`
      SELECT COALESCE(SUM(prime), 0) AS total
      FROM souscription_auto
      WHERE DATE(date_creation_client) = CURRENT_DATE
    `);

    const autoSemaine = await db.query(`
      SELECT COALESCE(SUM(prime), 0) AS total
      FROM souscription_auto
      WHERE DATE_TRUNC('week', date_creation_client) = DATE_TRUNC('week', CURRENT_DATE)
    `);

    const autoMois = await db.query(`
      SELECT COALESCE(SUM(prime), 0) AS total
      FROM souscription_auto
      WHERE DATE_TRUNC('month', date_creation_client) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    const autoAnnee = await db.query(`
      SELECT COALESCE(SUM(prime), 0) AS total
      FROM souscription_auto
      WHERE DATE_TRUNC('year', date_creation_client) = DATE_TRUNC('year', CURRENT_DATE)
    `);

    const vieJour = await db.query(`
      SELECT COALESCE(SUM(prime), 0) AS total
      FROM souscription_vie
      WHERE DATE(date_creation_client) = CURRENT_DATE
    `);

    const vieSemaine = await db.query(`
      SELECT COALESCE(SUM(prime), 0) AS total
      FROM souscription_vie
      WHERE DATE_TRUNC('week', date_creation_client) = DATE_TRUNC('week', CURRENT_DATE)
    `);

    const vieMois = await db.query(`
      SELECT COALESCE(SUM(prime), 0) AS total
      FROM souscription_vie
      WHERE DATE_TRUNC('month', date_creation_client) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    const vieAnnee = await db.query(`
      SELECT COALESCE(SUM(prime), 0) AS total
      FROM souscription_vie
      WHERE DATE_TRUNC('year', date_creation_client) = DATE_TRUNC('year', CURRENT_DATE)
    `);

    res.json({
      auto_aujourdhui: autoJour.rows[0].total,
      auto_semaine: autoSemaine.rows[0].total,
      auto_mois: autoMois.rows[0].total,
      auto_annee: autoAnnee.rows[0].total,
      vie_aujourdhui: vieJour.rows[0].total,
      vie_semaine: vieSemaine.rows[0].total,
      vie_mois: vieMois.rows[0].total,
      vie_annee: vieAnnee.rows[0].total
    });
  } catch (err) {
    console.error("Erreur CA :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


router.get('/nouveaux-contrats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        -- AUTO
        (SELECT COUNT(*) FROM souscription_auto WHERE date_creation_client::date = CURRENT_DATE) AS auto_aujourdhui,
        (SELECT COUNT(*) FROM souscription_auto WHERE date_creation_client >= date_trunc('week', CURRENT_DATE)) AS auto_semaine,
        (SELECT COUNT(*) FROM souscription_auto WHERE date_creation_client >= date_trunc('month', CURRENT_DATE)) AS auto_mois,
        (SELECT COUNT(*) FROM souscription_auto WHERE date_creation_client >= date_trunc('year', CURRENT_DATE)) AS auto_annee,

        -- VIE
        (SELECT COUNT(*) FROM souscription_vie WHERE date_creation_client::date = CURRENT_DATE) AS vie_aujourdhui,
        (SELECT COUNT(*) FROM souscription_vie WHERE date_creation_client >= date_trunc('week', CURRENT_DATE)) AS vie_semaine,
        (SELECT COUNT(*) FROM souscription_vie WHERE date_creation_client >= date_trunc('month', CURRENT_DATE)) AS vie_mois,
        (SELECT COUNT(*) FROM souscription_vie WHERE date_creation_client >= date_trunc('year', CURRENT_DATE)) AS vie_annee
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
     const caVieRes = await db.query(`
      SELECT
        SUM(CASE WHEN date_creation_client::date = CURRENT_DATE THEN prime ELSE 0 END) AS aujourdhui,
        SUM(CASE WHEN date_creation_client >= date_trunc('week', CURRENT_DATE) THEN prime ELSE 0 END) AS semaine,
        SUM(CASE WHEN date_creation_client >= date_trunc('month', CURRENT_DATE) THEN prime ELSE 0 END) AS mois,
        SUM(CASE WHEN date_creation_client >= date_trunc('year', CURRENT_DATE) THEN prime ELSE 0 END) AS annee
      FROM souscription_vie
      WHERE id_agent = 1;
    `);

    const caAutoRes = await db.query(`
      SELECT
        SUM(CASE WHEN date_creation_client::date = CURRENT_DATE THEN prime ELSE 0 END) AS aujourdhui,
        SUM(CASE WHEN date_creation_client >= date_trunc('week', CURRENT_DATE) THEN prime ELSE 0 END) AS semaine,
        SUM(CASE WHEN date_creation_client >= date_trunc('month', CURRENT_DATE) THEN prime ELSE 0 END) AS mois,
        SUM(CASE WHEN date_creation_client >= date_trunc('year', CURRENT_DATE) THEN prime ELSE 0 END) AS annee
      FROM souscription_auto
      WHERE id_agent = 1;
    `);

    const contratsVieRes = await db.query(`
      SELECT COUNT(*) AS nouveaux
      FROM souscription_vie
      WHERE id_agent = 1
        AND date_creation_client::date = CURRENT_DATE;
    `);

     const contratsAutoRes = await db.query(`
      SELECT COUNT(*) AS nouveaux
      FROM souscription_auto
      WHERE id_agent = 1
        AND date_creation_client::date = CURRENT_DATE;
    `);

    const tauxConversion = 28;

    const activite = {
      appels: 24,
      rdvs: 8,
      offres_envoyees: 15
    };

    // Retour JSON global
    res.json({
      ca: {
        vie: caVieRes.rows[0],
        auto: caAutoRes.rows[0]
      },
      nouveaux_contrats: {
        vie: parseInt(contratsVieRes.rows[0].nouveaux),
        auto: parseInt(contratsAutoRes.rows[0].nouveaux)
      },
      taux_conversion: tauxConversion,
      activite_commerciale: activite
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
