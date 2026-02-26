const User = require('../models/User');
const Boutique = require('../models/Boutique');
const Acheteur = require('../models/Acheteur');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route   POST /api/auth/register
// @desc    Inscription
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password, role, telephone, nomBoutique } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    user = new User({
      nom,
      prenom,
      email,
      password,
      role
    });

    await user.save();

    // Créer le profil spécifique selon le rôle
    if (role === 'boutique') {
      const boutique = new Boutique({
        _id: user._id,
        nomBoutique: nomBoutique || `${nom} ${prenom}`,
        telephone: telephone || ''
      });
      await boutique.save();
    } else if (role === 'acheteur') {
      const acheteur = new Acheteur({
        _id: user._id,
        telephone: telephone || ''
      });
      await acheteur.save();
    }

    // Créer le token JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        email: user.email
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: {
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   POST /api/auth/login
// @desc    Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si le compte est actif
    if (!user.actif) {
      return res.status(400).json({ msg: 'Compte désactivé' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
    }

    // Créer le token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        email: user.email
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: {
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            photo: user.photo
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   GET /api/auth/me
// @desc    Récupérer l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    }

    let profil = null;
    if (user.role === 'boutique') {
      profil = await Boutique.findById(user._id);
    } else if (user.role === 'acheteur') {
      profil = await Acheteur.findById(user._id);
    }

    res.json({ user, profil });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   POST /api/auth/init-admin
// @desc    Créer le premier admin (à supprimer après utilisation)
exports.initAdmin = async (req, res) => {
  try {
    // Vérifier s'il y a déjà un admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ msg: 'Un admin existe déjà' });
    }

    const { nom, prenom, email, password } = req.body;

    // Créer l'admin
    const admin = new User({
      nom: nom || 'Admin',
      prenom: prenom || 'System',
      email: email || 'admin@gmail.com',
      password: password || 'admin123',
      role: 'admin',
      actif: true
    });

    await admin.save();

    // Créer token pour connexion immédiate
    const payload = {
      user: {
        id: admin._id,
        role: admin.role,
        email: admin.email
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          msg: 'Admin créé avec succès',
          token,
          user: {
            id: admin._id,
            nom: admin.nom,
            prenom: admin.prenom,
            email: admin.email,
            role: admin.role
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   PUT /api/auth/update-me
exports.updateMe = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse, nomBoutique } = req.body;

    // 1. Mettre à jour les infos de base (User)
    const userFields = {};
    if (nom) userFields.nom = nom;
    if (prenom) userFields.prenom = prenom;

    if (req.file) {
      userFields.photo = `/uploads/profils/${req.file.filename}`;
    }
    
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    // 2. Mettre à jour le profil spécifique (Boutique ou Acheteur)
    let profil = null;
    
    if (user.role === 'boutique') {
      const boutiqueFields = {};
      if (nomBoutique) boutiqueFields.nomBoutique = nomBoutique;
      if (telephone) boutiqueFields.telephone = telephone;

      profil = await Boutique.findByIdAndUpdate(
        user._id,
        { $set: boutiqueFields },
        { new: true }
      );
    } else if (user.role === 'acheteur') {
      const acheteurFields = {};
      if (telephone) acheteurFields.telephone = telephone;
      if (adresse) acheteurFields.adresseLivraisonParDefaut = adresse;

      profil = await Acheteur.findByIdAndUpdate(
        user._id,
        { $set: acheteurFields },
        { new: true }
      );
    }

    res.json({ user, profil });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur lors de la mise à jour');
  }
};