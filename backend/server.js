const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connexion');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes PUBLIQUES d'abord
app.use('/api/auth', require('./routes/auth'));

// Routes principalement PUBLIQUES
app.use('/api/boutiques', require('./routes/boutiques'));
app.use('/api/produits', require('./routes/produits'));

// Routes PROTÉGÉES (avec middleware auth intégré dans les routes)
app.use('/api/commandes', require('./routes/commandes'));

app.get('/', (req, res) => {
  res.json({ 
    message: 'MEAN API running 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      boutiques: '/api/boutiques',
      produits: '/api/produits',
      commandes: '/api/commandes'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});