const express = require('express');
const router = express.Router();
const dashboardAcheteurController = require('../controllers/dashboardAcheteurController');
const auth = require('../middleware/auth');
const { acheteur } = require('../middleware/role');

// 🔒 Toutes les routes dashboard acheteur sont protégées
router.get('/stats', auth, acheteur, dashboardAcheteurController.getDashboardStats);
router.get('/commandes', auth, acheteur, dashboardAcheteurController.getCommandes);
router.get('/avis', auth, acheteur, dashboardAcheteurController.getAvis);

module.exports = router;