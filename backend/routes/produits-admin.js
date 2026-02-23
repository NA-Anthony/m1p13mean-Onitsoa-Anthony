const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/role');

// 🔒 TOUTES CES ROUTES SONT PROTÉGÉES (admin uniquement)
router.post('/', auth, admin, produitController.createProduitAdmin);
router.get('/all', auth, admin, produitController.getAllProduitsAdmin);
router.get('/stats', auth, admin, produitController.getProduitStatsAdmin);
router.put('/:id', auth, admin, produitController.updateProduitAdmin);
router.delete('/:id', auth, admin, produitController.deleteProduitAdmin);

module.exports = router;