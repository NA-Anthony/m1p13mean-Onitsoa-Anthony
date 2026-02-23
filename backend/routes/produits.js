const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const auth = require('../middleware/auth');

// ✅ TOUTES CES ROUTES SONT PUBLIQUES - PAS DE JWT
router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.getProduitById);
router.get('/categorie/:categorie', produitController.getProduitsByCategorie);
router.get('/recherche', produitController.rechercheProduits);

module.exports = router;