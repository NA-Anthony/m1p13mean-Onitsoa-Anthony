const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/role');

// 🔒 TOUTES LES ROUTES UTILISATEURS SONT PROTÉGÉES (admin)

// @route   POST /api/users
// @desc    Créer un nouvel utilisateur
router.post('/', auth, admin, userController.createUser);

// @route   GET /api/users
// @desc    Obtenir tous les utilisateurs
router.get('/', auth, admin, userController.getAllUsers);

// @route   GET /api/users/stats
// @desc    Statistiques utilisateurs
router.get('/stats', auth, admin, userController.getUserStats);

// @route   GET /api/users/role/:role
// @desc    Obtenir utilisateurs par rôle
router.get('/role/:role', auth, admin, userController.getUsersByRole);

// @route   GET /api/users/:id
// @desc    Obtenir un utilisateur par ID
router.get('/:id', auth, admin, userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Modifier un utilisateur
router.put('/:id', auth, admin, userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Supprimer un utilisateur
router.delete('/:id', auth, admin, userController.deleteUser);

// @route   PUT /api/users/:id/password
// @desc    Changer le mot de passe
router.put('/:id/password', auth, admin, userController.changePassword);

// @route   PUT /api/users/:id/toggle-actif
// @desc    Activer/Désactiver
router.put('/:id/toggle-actif', auth, admin, userController.toggleActif);

module.exports = router;
