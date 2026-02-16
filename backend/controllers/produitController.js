const Produit = require('../models/Produit');
const ProduitParBoutique = require('../models/ProduitParBoutique');
const Promotion = require('../models/Promotion');
const Avis = require('../models/Avis');

// ✅ ROUTE PUBLIQUE
// @route   GET /api/produits
// @desc    Obtenir tous les produits
exports.getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
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
    const boutiquesVendent = await ProduitParBoutique.find({ idProduit: req.params.id })
      .populate('idBoutique')
      .populate({
        path: 'idProduit',
        populate: { path: 'promotions', match: { actif: true } }
      });

    res.json({ produit, boutiques: boutiquesVendent });
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
        { description: { $regex: q, $options: 'i' } },
        { categorie: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(produits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   POST /api/produits
// @desc    Créer un produit (admin seulement)
exports.createProduit = async (req, res) => {
  try {
    const { nom, description, categorie, image, datePeremption, caracteristiques } = req.body;

    // Vérifier si le produit existe déjà
    const existant = await Produit.findOne({ nom: { $regex: new RegExp(`^${nom}$`, 'i') } });
    if (existant) {
      return res.status(400).json({ msg: 'Un produit avec ce nom existe déjà' });
    }

    const produit = new Produit({
      nom,
      description,
      categorie,
      image,
      datePeremption,
      caracteristiques
    });

    await produit.save();
    res.status(201).json(produit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   POST /api/produits/boutique
// @desc    Ajouter un produit à sa boutique
exports.addProduitToBoutique = async (req, res) => {
  try {
    const { idProduit, prix, stock } = req.body;
    const idBoutique = req.user.id;

    // Vérifier que le produit existe
    const produit = await Produit.findById(idProduit);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé dans le catalogue' });
    }

    // Vérifier si le produit existe déjà dans la boutique
    const existant = await ProduitParBoutique.findOne({
      idBoutique,
      idProduit
    });

    if (existant) {
      return res.status(400).json({ msg: 'Ce produit est déjà dans votre boutique' });
    }

    const produitBoutique = new ProduitParBoutique({
      idBoutique,
      idProduit,
      prix,
      stock: stock || 0
    });

    await produitBoutique.save();
    
    const populated = await ProduitParBoutique.findById(produitBoutique._id)
      .populate('idProduit')
      .populate('idBoutique');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   PUT /api/produits/boutique/:id
// @desc    Mettre à jour un produit de sa boutique
exports.updateProduitBoutique = async (req, res) => {
  try {
    const produit = await ProduitParBoutique.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Vérifier que c'est le propriétaire
    if (produit.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé - Cette boutique ne possède pas ce produit' });
    }

    const { prix, stock } = req.body;
    
    if (prix !== undefined) produit.prix = prix;
    if (stock !== undefined) produit.stock = stock;
    
    await produit.save();
    
    const updated = await ProduitParBoutique.findById(req.params.id)
      .populate('idProduit')
      .populate('idBoutique');

    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   DELETE /api/produits/boutique/:id
// @desc    Supprimer un produit de sa boutique
exports.deleteProduitBoutique = async (req, res) => {
  try {
    const produit = await ProduitParBoutique.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    if (produit.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    // Supprimer aussi les promotions associées
    await Promotion.deleteMany({ idProduitParBoutique: req.params.id });
    
    await produit.deleteOne();
    res.json({ msg: 'Produit retiré de la boutique avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   POST /api/produits/:id/promotion
// @desc    Ajouter une promotion à un produit
exports.addPromotion = async (req, res) => {
  try {
    const { remisePourcentage, dateDebut, dateFin } = req.body;

    // Vérifier que le produit appartient à la boutique
    const produit = await ProduitParBoutique.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    if (produit.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    // Désactiver les anciennes promotions
    await Promotion.updateMany(
      { idProduitParBoutique: req.params.id, actif: true },
      { actif: false }
    );

    const promotion = new Promotion({
      idProduitParBoutique: req.params.id,
      remisePourcentage,
      dateDebut,
      dateFin,
      actif: true
    });

    await promotion.save();

    // Mettre à jour le produit
    produit.enPromotion = true;
    await produit.save();

    res.status(201).json(promotion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   DELETE /api/produits/:id/promotion
// @desc    Supprimer la promotion d'un produit
exports.removePromotion = async (req, res) => {
  try {
    const produit = await ProduitParBoutique.findById(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    if (produit.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    await Promotion.updateMany(
      { idProduitParBoutique: req.params.id, actif: true },
      { actif: false }
    );

    produit.enPromotion = false;
    await produit.save();

    res.json({ msg: 'Promotion supprimée avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};