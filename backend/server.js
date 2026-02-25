const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connexion');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes PUBLIQUES d'abord
app.use('/api/auth', require('./routes/auth'));

// Routes principalement PUBLIQUES
app.use('/api/boutiques', require('./routes/boutiques'));
app.use('/api/produits', require('./routes/produits')); // ← DÉJÀ EXISTANT

// Route d'upload
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Routes PROTÉGÉES (admin)
app.use('/api/users', require('./routes/users'));
app.use('/api/boutiques-admin', require('./routes/boutiques-admin'));
app.use('/api/produits-admin', require('./routes/produits-admin')); // ← AJOUTER
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/portefeuille', require('./routes/portefeuille'));
app.use('/api/dashboard-boutique', require('./routes/dashboard-boutique')); 
app.use('/api/dashboard-acheteur', require('./routes/dashboard-acheteur'));

app.get('/', (req, res) => {
  res.json({
    message: 'MEAN API running 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      boutiques: '/api/boutiques',
      produits: '/api/produits',
      'produits-admin': '/api/produits-admin',
      commandes: '/api/commandes',
      upload: '/api/upload'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});