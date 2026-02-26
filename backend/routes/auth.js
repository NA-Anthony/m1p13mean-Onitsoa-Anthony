const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

// @route   POST /api/auth/register
router.post('/register', authController.register);

// TEMPORAIRE - À SUPPRIMER APRÈS UTILISATION
router.post('/init-admin', authController.initAdmin);

// @route   POST /api/auth/login
router.post('/login', authController.login);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

// Le middleware 'upload.single' DOIT être placé avant le contrôleur
router.put('/update-me', auth, upload.single('photo'), authController.updateMe);
module.exports = router;