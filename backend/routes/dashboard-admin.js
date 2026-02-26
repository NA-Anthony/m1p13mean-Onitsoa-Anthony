const express = require('express');
const router = express.Router();
const dashboardAdminController = require('../controllers/dashboardAdminController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/role');

// 🔒 Toutes les routes dashboard admin sont protégées (admin uniquement)
router.get('/stats', auth, admin, dashboardAdminController.getDashboardStats);
router.get('/top-boutiques', auth, admin, dashboardAdminController.getTopBoutiques);
router.get('/commandes-recentes', auth, admin, dashboardAdminController.getCommandesRecentes);
router.get('/evolution', auth, admin, dashboardAdminController.getEvolution);

module.exports = router;