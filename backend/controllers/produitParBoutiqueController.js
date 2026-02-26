const ProduitParBoutique = require('../models/ProduitParBoutique');
const Produit = require('../models/Produit');
const Promotion = require('../models/Promotion');
const Boutique = require('../models/Boutique');

// ✅ ROUTE PUBLIQUE
// @route   GET /api/produits-par-boutique
// @desc    Obtenir tous les produits par boutique (admin)
exports.getAllProduitsParBoutique = async (req, res) => {
    try {
      const produits = await ProduitParBoutique.find()
        .populate({
          path: 'idProduit',
          select: 'nom description categorie image caracteristiques'
        })
        .populate({
          path: 'idBoutique',
          select: 'nomBoutique adresse telephone logo'
        })
        .sort('-createdAt');
      
      console.log('Produits trouvés dans DB:', produits.length);
      
      if (produits.length === 0) {
        return res.json([]);
      }
      
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
          prodObj.enPromotion = true;
          prodObj.prixPromo = prod.prix * (1 - promo.remisePourcentage / 100);
          prodObj.promotion = promo;
        }
        
        return prodObj;
      }));
  
      console.log('Produits avec promos:', produitsAvecPromos.length);
      res.json(produitsAvecPromos);
    } catch (err) {
      console.error('Erreur:', err.message);
      res.status(500).json({ msg: 'Erreur serveur' });
    }
  };

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   GET /api/produits/boutique/mes-produits
// @desc    Obtenir les produits de la boutique connectée
exports.getMesProduits = async (req, res) => {
  try {
    const idBoutique = req.user.id;

    const produits = await ProduitParBoutique.find({ idBoutique })
      .populate('idProduit')
      .populate('idBoutique')
      .sort('-createdAt');
    
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
        prodObj.enPromotion = true;
        prodObj.prixPromo = prod.prix * (1 - promo.remisePourcentage / 100);
        prodObj.promotion = promo;
      }
      
      return prodObj;
    }));

    res.json(produitsAvecPromos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/produits/boutique/:id
// @desc    Obtenir un produit par boutique par ID
exports.getProduitParBoutiqueById = async (req, res) => {
  try {
    const produit = await ProduitParBoutique.findById(req.params.id)
      .populate('idProduit')
      .populate('idBoutique');
    
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Vérifier les promotions actives
    const promo = await Promotion.findOne({
      idProduitParBoutique: produit._id,
      actif: true,
      dateDebut: { $lte: new Date() },
      dateFin: { $gte: new Date() }
    });
    
    const produitObj = produit.toObject();
    if (promo) {
      produitObj.enPromotion = true;
      produitObj.prixPromo = produit.prix * (1 - promo.remisePourcentage / 100);
      produitObj.promotion = promo;
    }

    res.json(produitObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   POST /api/produits/boutique
// @desc    Ajouter un produit à sa boutique
exports.createProduitParBoutique = async (req, res) => {
  try {
    const { idProduit, prix, stock } = req.body;
    const idBoutique = req.user.id;

    // Vérifier que le produit existe
    const produit = await Produit.findById(idProduit);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Vérifier si le produit existe déjà dans la boutique
    const existant = await ProduitParBoutique.findOne({
      idBoutique,
      idProduit
    });

    if (existant) {
      return res.status(400).json({ msg: 'Ce produit est déjà dans votre boutique' });
    }

    const nouveauProduit = new ProduitParBoutique({
      idBoutique,
      idProduit,
      prix,
      stock: stock || 0
    });

    await nouveauProduit.save();
    
    const populated = await ProduitParBoutique.findById(nouveauProduit._id)
      .populate('idProduit')
      .populate('idBoutique');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   PUT /api/produits/boutique/:id
// @desc    Mettre à jour un produit de sa boutique
exports.updateProduitParBoutique = async (req, res) => {
  try {
    const { prix, stock } = req.body;
    const produitId = req.params.id;

    const produit = await ProduitParBoutique.findById(produitId);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Vérifier que c'est le propriétaire
    if (produit.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    if (prix !== undefined) produit.prix = prix;
    if (stock !== undefined) produit.stock = stock;
    
    await produit.save();
    
    const updated = await ProduitParBoutique.findById(produitId)
      .populate('idProduit')
      .populate('idBoutique');

    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   PATCH /api/produits/boutique/:id/stock
// @desc    Mettre à jour le stock
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const produitId = req.params.id;

    const produit = await ProduitParBoutique.findById(produitId);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    if (produit.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    produit.stock = stock;
    await produit.save();

    res.json(produit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   POST /api/produits/boutique/:id/promotion
// @desc    Ajouter une promotion à un produit
exports.ajouterPromotion = async (req, res) => {
    try {
      const { remisePourcentage, dateDebut, dateFin } = req.body;
      const produitId = req.params.id;
  
      // Vérifier que le produit existe et appartient à la boutique
      const produit = await ProduitParBoutique.findById(produitId);
      if (!produit) {
        return res.status(404).json({ msg: 'Produit non trouvé' });
      }
  
      if (produit.idBoutique.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Non autorisé' });
      }
  
      // Vérifier les dates
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      
      // Ajuster les dates pour inclure toute la journée
      debut.setHours(0, 0, 0, 0);
      fin.setHours(23, 59, 59, 999);
      
      const maintenant = new Date();
  
      if (fin < debut) {
        return res.status(400).json({ msg: 'La date de fin doit être après la date de début' });
      }
  
      // Vérifier s'il existe déjà une promotion qui chevauche cette période
      const promotionExistante = await Promotion.findOne({
        idProduitParBoutique: produitId,
        $or: [
          {
            dateDebut: { $lte: fin },
            dateFin: { $gte: debut }
          }
        ]
      });
  
      if (promotionExistante) {
        // Formater les dates pour le message
        const debutExistante = new Date(promotionExistante.dateDebut).toLocaleDateString('fr-FR');
        const finExistante = new Date(promotionExistante.dateFin).toLocaleDateString('fr-FR');
        
        return res.status(400).json({ 
          msg: `Une promotion existe déjà du ${debutExistante} au ${finExistante}. Veuillez choisir une autre période.` 
        });
      }
  
      // Créer la nouvelle promotion
      const nouvellePromotion = new Promotion({
        idProduitParBoutique: produitId,
        remisePourcentage,
        dateDebut: debut,
        dateFin: fin,
        actif: maintenant >= debut && maintenant <= fin
      });
  
      await nouvellePromotion.save();
  
      // Mettre à jour le produit
      produit.enPromotion = nouvellePromotion.actif;
      if (nouvellePromotion.actif) {
        produit.prixPromo = produit.prix * (1 - remisePourcentage / 100);
      }
      await produit.save();
  
      // Retourner le produit mis à jour
      const produitMisAJour = await ProduitParBoutique.findById(produitId)
        .populate('idProduit')
        .populate('idBoutique');
  
      res.json({
        produit: produitMisAJour,
        message: 'Promotion ajoutée avec succès'
      });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   DELETE /api/produits/boutique/:id/promotion
// @desc    Supprimer la promotion d'un produit
exports.supprimerPromotion = async (req, res) => {
  try {
    const produitId = req.params.id;

    const produit = await ProduitParBoutique.findById(produitId);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    if (produit.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    await Promotion.updateMany(
      { idProduitParBoutique: produitId, actif: true },
      { actif: false }
    );

    produit.enPromotion = false;
    produit.prixPromo = undefined;
    await produit.save();

    const updated = await ProduitParBoutique.findById(produitId)
      .populate('idProduit')
      .populate('idBoutique');

    res.json({
      produit: updated,
      message: 'Promotion supprimée avec succès'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   DELETE /api/produits/boutique/:id
// @desc    Supprimer un produit de sa boutique
exports.deleteProduitParBoutique = async (req, res) => {
  try {
    const produitId = req.params.id;

    const produit = await ProduitParBoutique.findById(produitId);
    if (!produit) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    if (produit.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    // Supprimer aussi les promotions associées
    await Promotion.deleteMany({ idProduitParBoutique: produitId });
    await produit.deleteOne();

    res.json({ msg: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   GET /api/produits/boutique/:id/promotions
// @desc    Obtenir l'historique des promotions d'un produit
exports.getHistoriquePromotions = async (req, res) => {
    try {
      const produitId = req.params.id;
  
      // Vérifier que le produit existe
      const produit = await ProduitParBoutique.findById(produitId);
      if (!produit) {
        return res.status(404).json({ msg: 'Produit non trouvé' });
      }
  
      // Récupérer toutes les promotions du produit
      const promotions = await Promotion.find({ idProduitParBoutique: produitId })
        .sort({ dateDebut: -1 }); // Tri du plus récent au plus ancien
  
      res.json(promotions);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  };