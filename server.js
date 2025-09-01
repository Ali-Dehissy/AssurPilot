  const express = require('express');
  const cors = require('cors');
  const db = require('./db');
  const app = express();
  const clientsRouter = require('./routes/clients');
  const loginRouter = require('./routes/login');
  const performanceRouter = require('./routes/performance');

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Assurpilot');
  });

  app.use('/api/clients', clientsRouter);
  app.use('/api', loginRouter);
  app.use('/api/performance', performanceRouter);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur le port ${PORT}`);
  });
