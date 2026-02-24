const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const produitParBoutiqueController = require('../controllers/produitParBoutiqueController');
const auth = require('../middleware/auth');
const { boutique } = require('../middleware/role');

// ✅ ROUTES PUBLIQUES
router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.getProduitById);
router.get('/categorie/:categorie', produitController.getProduitsByCategorie);
router.get('/recherche', produitController.rechercheProduits);
router.get('/boutiques/tous', produitParBoutiqueController.getAllProduitsParBoutique); // Tous les produits par boutique (public)

// 🔒 ROUTES PROTÉGÉES (boutique)
router.get('/boutique/mes-produits', auth, boutique, produitParBoutiqueController.getMesProduits);
router.get('/boutique/:id', auth, produitParBoutiqueController.getProduitParBoutiqueById);
router.post('/boutique', auth, boutique, produitParBoutiqueController.createProduitParBoutique);
router.put('/boutique/:id', auth, boutique, produitParBoutiqueController.updateProduitParBoutique);
router.patch('/boutique/:id/stock', auth, boutique, produitParBoutiqueController.updateStock);
router.post('/boutique/:id/promotion', auth, boutique, produitParBoutiqueController.ajouterPromotion);
router.delete('/boutique/:id/promotion', auth, boutique, produitParBoutiqueController.supprimerPromotion);
router.delete('/boutique/:id', auth, boutique, produitParBoutiqueController.deleteProduitParBoutique);

module.exports = router;