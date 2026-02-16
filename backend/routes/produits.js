const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const auth = require('../middleware/auth');
const { admin, boutique } = require('../middleware/role');

// ✅ ROUTES PUBLIQUES
router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.getProduitById); // À ajouter

// 🔒 ROUTES PROTÉGÉES
router.post('/', auth, admin, produitController.createProduit);
router.post('/boutique', auth, boutique, produitController.addProduitToBoutique);
router.put('/boutique/:id', auth, boutique, produitController.updateProduitBoutique);
router.delete('/boutique/:id', auth, boutique, produitController.deleteProduitBoutique);
router.post('/:id/promotion', auth, boutique, produitController.addPromotion);
router.delete('/:id/promotion', auth, boutique, produitController.removePromotion);

module.exports = router;