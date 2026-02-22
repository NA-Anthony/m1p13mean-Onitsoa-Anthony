const express = require('express');
const router = express.Router();
const boutiqueController = require('../controllers/boutiqueController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/role');

// 🔒 ADMIN ONLY ROUTES - Toutes protégées
// POST - Créer une nouvelle boutique
router.post('/', auth, admin, boutiqueController.createBoutiqueAdmin);

// GET - Tous les boutiques avec données utilisateur enrichies
router.get('/all', auth, admin, boutiqueController.getAllBoutiquesAdmin);

// GET - Statistiques des boutiques
router.get('/stats', auth, admin, boutiqueController.getBoutiqueStatsAdmin);

// PUT - Modifier une boutique (admin)
router.put('/:id', auth, admin, boutiqueController.updateBoutiqueAdmin);

// DELETE - Supprimer une boutique et l'utilisateur associé
router.delete('/:id', auth, admin, boutiqueController.deleteBoutiqueAdmin);

module.exports = router;
