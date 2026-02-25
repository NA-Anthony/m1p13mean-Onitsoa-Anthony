const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { admin, boutique, acheteur } = require('../middleware/role');
const portefeuilleController = require('../controllers/portefeuilleController');

// Route de dépôt (Acheteur seulement)
router.post('/depot', [auth, acheteur], portefeuilleController.deposerArgent);

// Route solde acheteur
router.get('/solde', [auth, acheteur], portefeuilleController.getSoldeAcheteur);

// Route caisse boutique
router.get('/caisse', [auth, boutique], portefeuilleController.getCaisseBoutique);

// Route historique transactions (commun)
router.get('/transactions', auth, portefeuilleController.getTransactions);

module.exports = router;
