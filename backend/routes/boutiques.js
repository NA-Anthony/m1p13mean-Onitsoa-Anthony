const express = require('express');
const router = express.Router();
const boutiqueController = require('../controllers/boutiqueController');
const auth = require('../middleware/auth');

// ✅ TOUTES CES ROUTES SONT PUBLIQUES - PAS DE JWT
router.get('/', boutiqueController.getAllBoutiques);
router.get('/:id', boutiqueController.getBoutiqueById);
router.get('/:id/produits', boutiqueController.getProduitsBoutique);
router.get('/:id/avis', boutiqueController.getAvisBoutique);

// 🔒 SEULEMENT LA MODIFICATION EST PROTÉGÉE
router.put('/:id', auth, boutiqueController.updateBoutique);

module.exports = router;