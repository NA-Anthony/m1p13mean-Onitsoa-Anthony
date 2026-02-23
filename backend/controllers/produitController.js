const Produit = require('../models/Produit');
const ProduitParBoutique = require('../models/ProduitParBoutique');

// ✅ ROUTE PUBLIQUE
// @route   GET /api/produits
// @desc    Obtenir tous les produits
exports.getAllProduits = async (req, res) => {
  try {
    const { categorie, search } = req.query;
    let filter = {};

    if (categorie) {
      filter.categorie = categorie;
    }

    if (search) {
      filter.nom = { $regex: search, $options: 'i' };
    }

    const produits = await Produit.find(filter).sort('-createdAt');
    res.json(produits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/produits/:id
// @desc    Obtenir un produit par ID
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Trouver toutes les boutiques qui vendent ce produit
    const boutiques = await ProduitParBoutique.find({ idProduit: req.params.id })
      .populate('idBoutique')
      .populate({
        path: 'idProduit',
        populate: { path: 'promotions', match: { actif: true } }
      });

    res.json({ produit, boutiques });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/produits/categorie/:categorie
// @desc    Obtenir produits par catégorie
exports.getProduitsByCategorie = async (req, res) => {
  try {
    const produits = await Produit.find({ categorie: req.params.categorie });
    res.json(produits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/produits/recherche
// @desc    Rechercher des produits
exports.rechercheProduits = async (req, res) => {
  try {
    const { q } = req.query;
    const produits = await Produit.find({
      $or: [
        { nom: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(produits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   POST /api/produits-admin
// @desc    Créer un nouveau produit
exports.createProduitAdmin = async (req, res) => {
  try {
    const { nom, description, categorie, image, datePeremption, caracteristiques } = req.body;

    // Valider les champs requis
    if (!nom) {
      return res.status(400).json({ msg: 'Le nom du produit est requis' });
    }
    if (!categorie) {
      return res.status(400).json({ msg: 'La catégorie est requise' });
    }

    // Vérifier si le produit existe déjà
    const existant = await Produit.findOne({ nom: { $regex: new RegExp(`^${nom}$`, 'i') } });
    if (existant) {
      return res.status(400).json({ msg: 'Un produit avec ce nom existe déjà' });
    }

    // Créer le nouveau produit
    const newProduit = new Produit({
      nom,
      description,
      categorie,
      image,
      datePeremption,
      caracteristiques: caracteristiques || {}
    });

    await newProduit.save();
    res.status(201).json({ msg: 'Produit créé avec succès', produit: newProduit });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erreur lors de la création du produit', error: err.message });
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   GET /api/produits-admin/all
// @desc    Obtenir tous les produits (vue admin)
exports.getAllProduitsAdmin = async (req, res) => {
  try {
    const produits = await Produit.find().sort('-createdAt');
    res.json(produits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   PUT /api/produits-admin/:id
// @desc    Modifier un produit
exports.updateProduitAdmin = async (req, res) => {
  try {
    const { nom, description, categorie, image, datePeremption, caracteristiques } = req.body;
    const produitId = req.params.id;

    let produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Mettre à jour les champs
    if (nom) produit.nom = nom;
    if (description !== undefined) produit.description = description;
    if (categorie) produit.categorie = categorie;
    if (image !== undefined) produit.image = image;
    if (datePeremption !== undefined) produit.datePeremption = datePeremption;
    if (caracteristiques !== undefined) produit.caracteristiques = caracteristiques;

    await produit.save();

    res.json({
      msg: 'Produit modifié avec succès',
      produit
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   DELETE /api/produits-admin/:id
// @desc    Supprimer un produit
exports.deleteProduitAdmin = async (req, res) => {
  try {
    const produitId = req.params.id;

    const produit = await Produit.findByIdAndDelete(produitId);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Supprimer aussi les entrées dans ProduitParBoutique
    await ProduitParBoutique.deleteMany({ idProduit: produitId });

    res.json({ msg: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   GET /api/produits-admin/stats
// @desc    Statistiques sur les produits
exports.getProduitStatsAdmin = async (req, res) => {
  try {
    const totalProduits = await Produit.countDocuments();
    
    const statsParCategorie = await Produit.aggregate([
      { $group: { _id: '$categorie', count: { $sum: 1 } } }
    ]);

    res.json({
      total: totalProduits,
      parCategorie: statsParCategorie
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};