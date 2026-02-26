const Avis = require('../models/Avis');
const Commande = require('../models/Commande');
const ProduitParBoutique = require('../models/ProduitParBoutique');
const Boutique = require('../models/Boutique');

// ✅ ROUTE PUBLIQUE
// @route   GET /api/avis
// @desc    Obtenir tous les avis (avec filtres optionnels)
exports.getAllAvis = async (req, res) => {
  try {
    const { produit, boutique, note, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let filter = {};
    
    if (produit) {
      const produits = await ProduitParBoutique.find({ idProduit: produit }).select('_id');
      filter.idProduitParBoutique = { $in: produits.map(p => p._id) };
    }
    
    if (boutique) {
      const produits = await ProduitParBoutique.find({ idBoutique: boutique }).select('_id');
      filter.idProduitParBoutique = { $in: produits.map(p => p._id) };
    }
    
    if (note) {
      filter.note = parseInt(note);
    }

    const avis = await Avis.find(filter)
      .populate('idAcheteur', 'nom prenom telephone photo')
      .populate({
        path: 'idProduitParBoutique',
        populate: [
          { path: 'idProduit', select: 'nom image categorie' },
          { path: 'idBoutique', select: 'nomBoutique logo' }
        ]
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await Avis.countDocuments(filter);

    res.json({
      avis,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (err) {
    console.error('Erreur getAllAvis:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/avis/:id
// @desc    Obtenir un avis par ID
exports.getAvisById = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id)
      .populate('idAcheteur', 'nom prenom telephone photo')
      .populate({
        path: 'idProduitParBoutique',
        populate: [
          { path: 'idProduit', select: 'nom image categorie' },
          { path: 'idBoutique', select: 'nomBoutique logo' }
        ]
      });

    if (!avis) {
      return res.status(404).json({ msg: 'Avis non trouvé' });
    }

    res.json(avis);

  } catch (err) {
    console.error('Erreur getAvisById:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/avis/produit/:idProduitParBoutique
// @desc    Obtenir les avis d'un produit spécifique
exports.getAvisByProduit = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const avis = await Avis.find({ idProduitParBoutique: req.params.idProduitParBoutique })
      .populate('idAcheteur', 'nom prenom photo')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await Avis.countDocuments({ idProduitParBoutique: req.params.idProduitParBoutique });

    // Calculer la note moyenne
    const noteMoyenne = avis.length > 0 
      ? avis.reduce((acc, a) => acc + a.note, 0) / avis.length 
      : 0;

    res.json({
      avis,
      noteMoyenne: Math.round(noteMoyenne * 10) / 10,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (err) {
    console.error('Erreur getAvisByProduit:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// ✅ ROUTE PUBLIQUE
// @route   GET /api/avis/acheteur/:idAcheteur
// @desc    Obtenir les avis d'un acheteur
exports.getAvisByAcheteur = async (req, res) => {
  try {
    const avis = await Avis.find({ idAcheteur: req.params.idAcheteur })
      .populate({
        path: 'idProduitParBoutique',
        populate: [
          { path: 'idProduit', select: 'nom image' },
          { path: 'idBoutique', select: 'nomBoutique' }
        ]
      })
      .sort('-createdAt');

    res.json(avis);

  } catch (err) {
    console.error('Erreur getAvisByAcheteur:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// 🔒 ROUTE PROTÉGÉE (acheteur)
// @route   POST /api/avis
// @desc    Créer un nouvel avis
exports.createAvis = async (req, res) => {
  try {
    const { idProduitParBoutique, note, commentaire } = req.body;
    const idAcheteur = req.user.id;

    // Vérifier que l'acheteur a bien acheté ce produit
    const aAchete = await Commande.findOne({
      idAcheteur,
      'articles.idProduitParBoutique': idProduitParBoutique,
      statut: 'livrée'
    });

    if (!aAchete) {
      return res.status(403).json({ 
        msg: 'Vous devez avoir acheté et reçu ce produit pour laisser un avis' 
      });
    }

    // Vérifier si l'acheteur a déjà laissé un avis pour ce produit
    const existe = await Avis.findOne({
      idAcheteur,
      idProduitParBoutique
    });

    if (existe) {
      return res.status(400).json({ 
        msg: 'Vous avez déjà laissé un avis pour ce produit' 
      });
    }

    // Créer l'avis
    const nouvelAvis = new Avis({
      idAcheteur,
      idProduitParBoutique,
      note,
      commentaire
    });

    await nouvelAvis.save();

    // Mettre à jour la note moyenne de la boutique
    await this.mettreAJourNoteBoutique(idProduitParBoutique);

    const avisPopulated = await Avis.findById(nouvelAvis._id)
      .populate('idAcheteur', 'nom prenom photo')
      .populate({
        path: 'idProduitParBoutique',
        populate: [
          { path: 'idProduit', select: 'nom image' },
          { path: 'idBoutique', select: 'nomBoutique' }
        ]
      });

    res.status(201).json(avisPopulated);

  } catch (err) {
    console.error('Erreur createAvis:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// 🔒 ROUTE PROTÉGÉE (acheteur)
// @route   PUT /api/avis/:id
// @desc    Modifier son avis
exports.updateAvis = async (req, res) => {
  try {
    const { note, commentaire } = req.body;
    const avisId = req.params.id;

    const avis = await Avis.findById(avisId);

    if (!avis) {
      return res.status(404).json({ msg: 'Avis non trouvé' });
    }

    // Vérifier que c'est bien l'auteur
    if (avis.idAcheteur.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    if (note !== undefined) avis.note = note;
    if (commentaire !== undefined) avis.commentaire = commentaire;

    await avis.save();

    // Mettre à jour la note moyenne de la boutique
    await this.mettreAJourNoteBoutique(avis.idProduitParBoutique);

    const avisPopulated = await Avis.findById(avisId)
      .populate('idAcheteur', 'nom prenom photo')
      .populate({
        path: 'idProduitParBoutique',
        populate: [
          { path: 'idProduit', select: 'nom image' },
          { path: 'idBoutique', select: 'nomBoutique' }
        ]
      });

    res.json(avisPopulated);

  } catch (err) {
    console.error('Erreur updateAvis:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   PUT /api/avis/:id/repondre
// @desc    Répondre à un avis
exports.repondreAvis = async (req, res) => {
  try {
    const { reponse } = req.body;
    const avisId = req.params.id;

    const avis = await Avis.findById(avisId)
      .populate({
        path: 'idProduitParBoutique',
        populate: { path: 'idBoutique' }
      });

    if (!avis) {
      return res.status(404).json({ msg: 'Avis non trouvé' });
    }

    // Vérifier que c'est la boutique concernée
    if (avis.idProduitParBoutique.idBoutique._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    avis.reponseBoutique = {
      commentaire: reponse,
      date: new Date()
    };

    await avis.save();

    const avisPopulated = await Avis.findById(avisId)
      .populate('idAcheteur', 'nom prenom photo')
      .populate({
        path: 'idProduitParBoutique',
        populate: [
          { path: 'idProduit', select: 'nom image' },
          { path: 'idBoutique', select: 'nomBoutique' }
        ]
      });

    res.json(avisPopulated);

  } catch (err) {
    console.error('Erreur repondreAvis:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// 🔒 ROUTE PROTÉGÉE (admin ou auteur)
// @route   DELETE /api/avis/:id
// @desc    Supprimer un avis
exports.deleteAvis = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);

    if (!avis) {
      return res.status(404).json({ msg: 'Avis non trouvé' });
    }

    // Vérifier les droits (admin ou auteur)
    if (req.user.role !== 'admin' && avis.idAcheteur.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    const idProduitParBoutique = avis.idProduitParBoutique;
    await avis.deleteOne();

    // Mettre à jour la note moyenne de la boutique
    await this.mettreAJourNoteBoutique(idProduitParBoutique);

    res.json({ msg: 'Avis supprimé avec succès' });

  } catch (err) {
    console.error('Erreur deleteAvis:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// 🔒 FONCTION UTILITAIRE
// @desc    Met à jour la note moyenne d'une boutique
exports.mettreAJourNoteBoutique = async (idProduitParBoutique) => {
  try {
    const produit = await ProduitParBoutique.findById(idProduitParBoutique);
    if (!produit) return;

    // Récupérer tous les produits de la boutique
    const produits = await ProduitParBoutique.find({ idBoutique: produit.idBoutique });
    const idsProduits = produits.map(p => p._id);

    // Récupérer tous les avis de la boutique
    const avis = await Avis.find({ 
      idProduitParBoutique: { $in: idsProduits } 
    });

    if (avis.length === 0) {
      await Boutique.findByIdAndUpdate(produit.idBoutique, {
        noteMoyenne: 0,
        totalAvis: 0
      });
      return;
    }

    const sommeNotes = avis.reduce((acc, a) => acc + a.note, 0);
    const noteMoyenne = sommeNotes / avis.length;

    await Boutique.findByIdAndUpdate(produit.idBoutique, {
      noteMoyenne: Math.round(noteMoyenne * 10) / 10,
      totalAvis: avis.length
    });

  } catch (err) {
    console.error('Erreur mise à jour note boutique:', err.message);
  }
};