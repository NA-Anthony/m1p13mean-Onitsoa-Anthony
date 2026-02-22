const User = require('../models/User');
const Boutique = require('../models/Boutique');
const Acheteur = require('../models/Acheteur');
const bcrypt = require('bcryptjs');

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   POST /api/users
// @desc    Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, role, photo } = req.body;

    // Valider les champs obligatoires
    if (!nom || !prenom || !email || !password || !role) {
      return res.status(400).json({ msg: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Valider le rôle
    const validRoles = ['admin', 'boutique', 'acheteur'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Rôle invalide' });
    }

    // Valider la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Le mot de passe doit faire au moins 6 caractères' });
    }

    // Vérifier si l'email existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    user = new User({
      nom,
      prenom,
      email,
      password, // Sera hashé par le pre-save hook
      role,
      photo: photo || 'assets/images/avatars/default.jpg',
      actif: true
    });

    await user.save();

    // Créer le profil spécifique selon le rôle
    if (role === 'boutique') {
      const boutique = new Boutique({
        _id: user._id,
        nom: `Boutique de ${prenom} ${nom}`
      });
      await boutique.save();
    } else if (role === 'acheteur') {
      const acheteur = new Acheteur({
        _id: user._id,
        nom: `${prenom} ${nom}`
      });
      await acheteur.save();
    }

    res.status(201).json({
      msg: 'Utilisateur créé avec succès',
      user: user.toObject({ versionKey: false })
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   GET /api/users
// @desc    Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   GET /api/users/:id
// @desc    Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    }

    // Récupérer le profil spécifique si c'est une boutique ou acheteur
    let profile = null;
    if (user.role === 'boutique') {
      profile = await Boutique.findById(user._id);
    } else if (user.role === 'acheteur') {
      profile = await Acheteur.findById(user._id);
    }

    res.json({ user, profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   PUT /api/users/:id
// @desc    Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { nom, prenom, email, role, photo, actif } = req.body;
    const userId = req.params.id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Cet email est déjà utilisé' });
      }
    }

    // Mettre à jour les champs
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;
    if (photo !== undefined) user.photo = photo;
    if (actif !== undefined) user.actif = actif;

    // ⚠️ NE PAS CHANGER LE RÔLE (trop complexe, crée/supprime des profils)
    // Si besoin, créer une route spécifique

    await user.save();

    res.json({
      msg: 'Utilisateur modifié',
      user: user.toObject({ virtuals: false, versionKey: false, _id: true })
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   DELETE /api/users/:id
// @desc    Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    }

    // Supprimer le profil spécifique
    if (user.role === 'boutique') {
      await Boutique.findByIdAndDelete(userId);
    } else if (user.role === 'acheteur') {
      await Acheteur.findByIdAndDelete(userId);
    }

    res.json({ msg: 'Utilisateur supprimé' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   PUT /api/users/:id/password
// @desc    Changer le mot de passe d'un utilisateur
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.params.id;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ msg: 'Le mot de passe doit faire au moins 6 caractères' });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    }

    user.password = newPassword; // Sera hashé par le pre-save hook
    await user.save();

    res.json({ msg: 'Mot de passe modifié' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   PUT /api/users/:id/toggle-actif
// @desc    Activer/Désactiver un utilisateur
exports.toggleActif = async (req, res) => {
  try {
    const userId = req.params.id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    }

    user.actif = !user.actif;
    await user.save();

    res.json({
      msg: `Utilisateur ${user.actif ? 'activé' : 'désactivé'}`,
      user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   GET /api/users/role/:role
// @desc    Obtenir les utilisateurs par rôle
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['admin', 'boutique', 'acheteur'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Rôle invalide' });
    }

    const users = await User.find({ role }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 📊 ROUTE PROTÉGÉE (admin)
// @route   GET /api/users/stats
// @desc    Statistiques sur les utilisateurs
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const boutiqueCount = await User.countDocuments({ role: 'boutique' });
    const acheteurCount = await User.countDocuments({ role: 'acheteur' });
    const actifCount = await User.countDocuments({ actif: true });

    res.json({
      total: totalUsers,
      admin: adminCount,
      boutique: boutiqueCount,
      acheteur: acheteurCount,
      actif: actifCount,
      inactif: totalUsers - actifCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
