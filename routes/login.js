const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    const result = await pool.query('SELECT * FROM agents WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const agent = result.rows[0];

       const isMatch = await bcrypt.compare(password, agent.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const { password: pwd, ...agentSafe } = agent;

    return res.json({ message: 'Connexion réussie', agent: agentSafe });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
