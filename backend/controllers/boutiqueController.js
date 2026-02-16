const Boutique = require('../models/Boutique');
const ProduitParBoutique = require('../models/ProduitParBoutique');
const Produit = require('../models/Produit');
const Promotion = require('../models/Promotion');
const Avis = require('../models/Avis');
const User = require('../models/User');

// ✅ ROUTE PUBLIQUE
// @route   GET /api/boutiques
// @desc    Obtenir toutes les boutiques avec filtre optionnel
exports.getAllBoutiques = async (req, res) => {
  try {
    const { search, ville } = req.query;
    let filter = {};

    if (search) {
      filter.nomBoutique = { $regex: search, $options: 'i' };
    }

    if (ville) {
      filter.adresse = { $regex: ville, $options: 'i' };
    }

    const boutiques = await Boutique.find(filter)
      .populate('_id', 'nom prenom email photo dateCreation');

    res.json(boutiques);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/boutiques/:id
// @desc    Obtenir une boutique par ID
exports.getBoutiqueById = async (req, res) => {
  try {
    const boutique = await Boutique.findById(req.params.id)
      .populate('_id', 'nom prenom email photo');
    
    if (!boutique) {
      return res.status(404).json({ msg: 'Boutique non trouvée' });
    }

    // Récupérer les produits avec leurs promotions
    const produits = await ProduitParBoutique.find({ idBoutique: req.params.id, stock: { $gt: 0 } })
      .populate('idProduit')
      .limit(20);

    // Ajouter les promotions actives
    const produitsAvecPromos = await Promise.all(produits.map(async (prod) => {
      const promo = await Promotion.findOne({
        idProduitParBoutique: prod._id,
        actif: true,
        dateDebut: { $lte: new Date() },
        dateFin: { $gte: new Date() }
      });
      
      const prodObj = prod.toObject();
      if (promo) {
        prodObj.promotion = promo;
        prodObj.prixPromo = prod.prix * (1 - promo.remisePourcentage / 100);
      }
      
      return prodObj;
    }));

    res.json({ 
      boutique, 
      produits: produitsAvecPromos,
      totalProduits: produits.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/boutiques/:id/produits
// @desc    Obtenir les produits d'une boutique avec pagination
exports.getProduitsBoutique = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const produits = await ProduitParBoutique.find({ 
      idBoutique: req.params.id,
      stock: { $gt: 0 }
    })
      .populate('idProduit')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');
    
    const total = await ProduitParBoutique.countDocuments({ 
      idBoutique: req.params.id,
      stock: { $gt: 0 }
    });

    // Ajouter les promotions
    const produitsAvecPromos = await Promise.all(produits.map(async (prod) => {
      const promo = await Promotion.findOne({
        idProduitParBoutique: prod._id,
        actif: true,
        dateDebut: { $lte: new Date() },
        dateFin: { $gte: new Date() }
      });
      
      const prodObj = prod.toObject();
      if (promo) {
        prodObj.promotion = promo;
        prodObj.prixPromo = prod.prix * (1 - promo.remisePourcentage / 100);
      }
      
      return prodObj;
    }));

    res.json({
      produits: produitsAvecPromos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/boutiques/:id/avis
// @desc    Obtenir les avis d'une boutique
exports.getAvisBoutique = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Récupérer tous les produits de la boutique
    const produits = await ProduitParBoutique.find({ idBoutique: req.params.id })
      .select('_id');
    
    const idsProduits = produits.map(p => p._id);

    const avis = await Avis.find({ 
      idProduitParBoutique: { $in: idsProduits } 
    })
      .populate('idAcheteur', 'nom prenom photo')
      .populate({
        path: 'idProduitParBoutique',
        populate: { path: 'idProduit', select: 'nom image' }
      })
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await Avis.countDocuments({ 
      idProduitParBoutique: { $in: idsProduits } 
    });

    // Calculer la note moyenne
    let noteMoyenne = 0;
    if (total > 0) {
      const sumNotes = await Avis.aggregate([
        { $match: { idProduitParBoutique: { $in: idsProduits } } },
        { $group: { _id: null, total: { $sum: '$note' } } }
      ]);
      noteMoyenne = sumNotes[0]?.total / total || 0;
    }

    res.json({
      avis,
      noteMoyenne: Math.round(noteMoyenne * 10) / 10,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE
// @route   PUT /api/boutiques/:id
// @desc    Mettre à jour une boutique
exports.updateBoutique = async (req, res) => {
  try {
    // Vérifier que c'est le propriétaire ou admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Non autorisé - Vous n\'êtes pas le propriétaire de cette boutique' });
    }

    const boutique = await Boutique.findById(req.params.id);
    if (!boutique) {
      return res.status(404).json({ msg: 'Boutique non trouvée' });
    }

    // Champs autorisés à modifier
    const allowedUpdates = [
      'nomBoutique', 'description', 'adresse', 'telephone', 
      'logo', 'modePaiementAcceptes', 'horaires'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        boutique[field] = req.body[field];
      }
    });

    await boutique.save();
    
    const updated = await Boutique.findById(req.params.id)
      .populate('_id', 'nom prenom email photo');

    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};