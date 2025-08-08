// routes/clients.js
const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.post('/', async (req, res) => {
  const client = req.body;

  const query = `
    INSERT INTO clients (
      date_naissance, lieu_naissance, age, type_piece_identite, numero_identite,
      date_delivrance, lieu_delivrance, genre, civilite, nom, prenom, etat_civil,
      nationalite, fixe, mobile, fax, email, statut_professionnel, profession,
      gouvernorat, ville, code_postal, adresse, adresse_pro, agent_id
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18, $19,
      $20, $21, $22, $23, $24, $25
    ) RETURNING id;
  `;

  const values = [
    client.date_naissance, client.lieu_naissance, client.age, client.type_piece_identite, client.numero_identite,
    client.date_delivrance, client.lieu_delivrance, client.genre, client.civilite, client.nom, client.prenom, client.etat_civil,
    client.nationalite, client.fixe, client.mobile, client.fax, client.email, client.statut_professionnel, client.profession,
    client.gouvernorat, client.ville, client.code_postal, client.adresse, client.adresse_pro,
    client.agent_id // <== Ajout ici
  ];

  try {
    const result = await db.query(query, values);
    res.status(201).json({ id: result.rows[0].id, message: 'Client ajouté avec succès.' });
  } catch (err) {
    console.error('Erreur PostgreSQL:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
