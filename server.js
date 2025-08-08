  const express = require('express');
  const cors = require('cors');
  const db = require('./db');
  const clientsRouter = require('./routes/clients');
  const authRouter = require('./routes/auth');
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Assurpilot');
  });

  app.use('/api/clients', clientsRouter);
  app.use('/api', authRouter);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur le port ${PORT}`);
  });
