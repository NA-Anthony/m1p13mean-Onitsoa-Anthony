const express = require('express');
const router = express.Router();
const dashboardBoutiqueController = require('../controllers/dashboardBoutiqueController');
const auth = require('../middleware/auth');
const { boutique } = require('../middleware/role');

// 🔒 Toutes les routes dashboard boutique sont protégées
router.get('/stats', auth, boutique, dashboardBoutiqueController.getDashboardStats);
router.get('/commandes', auth, boutique, dashboardBoutiqueController.getCommandes);
router.get('/produits', auth, boutique, dashboardBoutiqueController.getProduits);
router.get('/avis', auth, boutique, dashboardBoutiqueController.getAvis);

module.exports = router;