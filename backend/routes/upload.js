const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuration de l'upload
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// Route d'upload (protégée)
router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Aucun fichier uploadé' });
    }
    
    // Retourner l'URL de l'image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ 
      imageUrl,
      filename: req.file.filename,
      msg: 'Image uploadée avec succès'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;