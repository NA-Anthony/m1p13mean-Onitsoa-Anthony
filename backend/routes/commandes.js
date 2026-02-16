const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const auth = require('../middleware/auth');
const { acheteur, boutique, admin } = require('../middleware/role');

// 🔒 TOUTES LES ROUTES COMMANDES SONT PROTÉGÉES

// Acheteur : passer une commande
router.post('/', auth, acheteur, commandeController.createCommande);

// Acheteur : voir ses commandes
router.get('/acheteur', auth, acheteur, commandeController.getMesCommandes);

// Boutique : voir les commandes reçues
router.get('/boutique', auth, boutique, commandeController.getCommandesBoutique);

// Admin : voir toutes les commandes (optionnel)
router.get('/admin', auth, admin, commandeController.getAllCommandes);

// Détail d'une commande (accessible par le propriétaire ou admin)
router.get('/:id', auth, commandeController.getCommandeById);

// Mettre à jour le statut d'une commande (boutique ou admin)
router.put('/:id/statut', auth, commandeController.updateStatut);

// Mettre à jour le paiement (acheteur ou admin)
router.put('/:id/paiement', auth, commandeController.updatePaiement);

// Annuler une commande (acheteur ou admin)
router.put('/:id/annuler', auth, commandeController.annulerCommande);

module.exports = router;