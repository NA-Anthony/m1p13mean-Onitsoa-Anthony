const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');
const auth = require('../middleware/auth');
const { acheteur, boutique, admin } = require('../middleware/role');

// ✅ ROUTES PUBLIQUES
router.get('/', avisController.getAllAvis);
router.get('/:id', avisController.getAvisById);
router.get('/produit/:idProduitParBoutique', avisController.getAvisByProduit);
router.get('/acheteur/:idAcheteur', avisController.getAvisByAcheteur);

// 🔒 ROUTES PROTÉGÉES
router.post('/', auth, acheteur, avisController.createAvis);
router.put('/:id', auth, acheteur, avisController.updateAvis);
router.put('/:id/repondre', auth, boutique, avisController.repondreAvis);
router.delete('/:id', auth, avisController.deleteAvis); // Admin ou auteur

module.exports = router;