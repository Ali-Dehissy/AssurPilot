const express = require('express');
const router = express.Router();
const db = require('../db');

/*Vie*/
router.post('/', async (req, res) => {
  const client = req.body;

  const query = `
    INSERT INTO souscription_vie (
      date_naissance, lieu_naissance, age, type_piece_identite, numero_identite,
      date_delivrance, lieu_delivrance, genre, civilite, nom, prenom, etat_civil,
      nationalite, fixe, mobile, fax, email, statut_professionnel, profession,
      gouvernorat, ville, code_postal, adresse, adresse_pro, agent_id, id_agent, prime, date_creation_client
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18, $19,
      $20, $21, $22, $23, $24, $25, $26, $27, $28
    ) RETURNING id;
  `;

  const values = [
    client.date_naissance, client.lieu_naissance, client.age, client.type_piece_identite, client.numero_identite,
    client.date_delivrance, client.lieu_delivrance, client.genre, client.civilite, client.nom, client.prenom, client.etat_civil,
    client.nationalite, client.fixe, client.mobile, client.fax, client.email, client.statut_professionnel, client.profession,
    client.gouvernorat, client.ville, client.code_postal, client.adresse, client.adresse_pro,
    client.agent_id, client.id_agent, client.prime, client.date_creation_client
  ];

  try {
    const result = await db.query(query, values);
    res.status(201).json({ id: result.rows[0].id, message: 'Client ajouté avec succès.' });
  } catch (err) {
    console.error('Erreur PostgreSQL:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/*Auto*/
router.post('/', async (req, res) => {
const client = req.body;


const query = `
INSERT INTO souscription_auto (
nom, prenom, raison_sociale, cin, matricule_fiscale, adresse,
matricule_auto, date_mise_en_circulation, valeur_venale, date_creation_client,
numero_contrat, type_voiture, id_agent, prime
) VALUES (
$1, $2, $3, $4, $5, $6,
$7, $8, $9, $10,
$11, $12, $13, $14
) RETURNING id;
`;


const values = [
client.nom, client.prenom, client.raison_sociale, client.cin, client.matricule_fiscale, client.adresse,
client.matricule_auto, client.date_mise_en_circulation, client.valeur_venale, client.date_creation_client || new Date().toISOString(),
client.numero_contrat, client.type_voiture, client.id_agent, client.prime
];


try {
const result = await db.query(query, values);
res.status(201).json({ id: result.rows[0].id, message: 'Client auto ajouté avec succès.' });
} catch (err) {
console.error('Erreur PostgreSQL:', err);
res.status(500).json({ error: 'Erreur serveur.' });
}
});


router.get('/agent/:agentId', async (req, res) => {
  const { agentId } = req.params;
  try {
    const query = 'SELECT * FROM clients WHERE agent_id = $1';
    const { rows } = await db.query(query, [agentId]);
    res.json(rows);
  } catch (err) {
    console.error('Erreur PostgreSQL:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});


module.exports = router;
