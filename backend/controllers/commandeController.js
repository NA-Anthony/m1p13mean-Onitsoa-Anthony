const Commande = require('../models/Commande');
const Livraison = require('../models/Livraison');
const ProduitParBoutique = require('../models/ProduitParBoutique');
const Promotion = require('../models/Promotion');
const Acheteur = require('../models/Acheteur');
const Boutique = require('../models/Boutique');
const Transaction = require('../models/Transaction');

// 🔒 ROUTE PROTÉGÉE (acheteur)
// @route   POST /api/commandes
// @desc    Créer une commande
exports.createCommande = async (req, res) => {
  try {
    const { idBoutique, articles, adresseLivraison, fraisLivraison, modePaiement } = req.body;
    const idAcheteur = req.user.id;

    // Vérifications
    if (!articles || articles.length === 0) {
      return res.status(400).json({ msg: 'La commande doit contenir au moins un article' });
    }

    // Vérifier que tous les produits existent et ont du stock
    let total = 0;
    const articlesVerifies = [];

    for (let article of articles) {
      const produit = await ProduitParBoutique.findById(article.idProduitParBoutique)
        .populate('idProduit');

      if (!produit) {
        return res.status(404).json({ msg: `Produit non trouvé` });
      }

      if (produit.idBoutique.toString() !== idBoutique) {
        return res.status(400).json({ msg: `Ce produit n'appartient pas à cette boutique` });
      }

      if (produit.stock < article.quantite) {
        return res.status(400).json({
          msg: `Stock insuffisant pour ${produit.idProduit.nom}. Disponible: ${produit.stock}`
        });
      }

      // Vérifier s'il y a une promotion active
      let prix = produit.prix;
      const promotion = await Promotion.findOne({
        idProduitParBoutique: produit._id,
        actif: true,
        dateDebut: { $lte: new Date() },
        dateFin: { $gte: new Date() }
      });

      if (promotion) {
        prix = produit.prix * (1 - promotion.remisePourcentage / 100);
      }

      articlesVerifies.push({
        idProduitParBoutique: produit._id,
        nomProduit: produit.idProduit.nom,
        prixUnitaire: Math.round(prix * 100) / 100,
        quantite: article.quantite,
        remise: promotion ? promotion.remisePourcentage : 0
      });

      total += prix * article.quantite;
    }

    const montantTotal = Math.round((total + (fraisLivraison || 0)) * 100) / 100;

    // --- LOGIQUE PAIEMENT PORTEFEUILLE ---
    let estPayee = false;
    if (modePaiement === 'portefeuille') {
      const acheteur = await Acheteur.findById(idAcheteur);
      if (!acheteur || acheteur.solde < montantTotal) {
        return res.status(400).json({ msg: 'Solde insuffisant dans votre portefeuille' });
      }

      const boutique = await Boutique.findById(idBoutique);
      if (!boutique) return res.status(404).json({ msg: 'Boutique non trouvée' });

      // Transfert
      acheteur.solde -= montantTotal;
      boutique.caisse += montantTotal;
      estPayee = true;

      await acheteur.save();
      await boutique.save();

      // Enregistrer les transactions
      await new Transaction({
        idUser: idAcheteur,
        type: 'achat',
        montant: -montantTotal,
        description: `Paiement commande boutique: ${boutique.nomBoutique}`
      }).save();

      await new Transaction({
        idUser: idBoutique,
        type: 'vente',
        montant: montantTotal,
        description: `Vente commande de l'acheteur ID: ${idAcheteur}`
      }).save();
    }

    const commande = new Commande({
      idAcheteur,
      idBoutique,
      articles: articlesVerifies,
      adresseLivraison,
      fraisLivraison: fraisLivraison || 0,
      total: montantTotal,
      modePaiement,
      statut: 'en_attente',
      paiementEffectue: estPayee
    });

    await commande.save();

    // Réduire les stocks
    for (let article of articles) {
      await ProduitParBoutique.findByIdAndUpdate(
        article.idProduitParBoutique,
        { $inc: { stock: -article.quantite } }
      );
    }

    // Créer la livraison
    const livraison = new Livraison({
      idCommande: commande._id,
      statut: 'en_attente'
    });
    await livraison.save();

    const populated = await Commande.findById(commande._id)
      .populate('idBoutique', 'nomBoutique')
      .populate('idAcheteur', 'nom prenom email');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (acheteur)
// @route   GET /api/commandes/acheteur
// @desc    Obtenir les commandes d'un acheteur
exports.getMesCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find({ idAcheteur: req.user.id })
      .populate('idBoutique', 'nomBoutique logo')
      .sort('-dateCommande');

    // Récupérer les livraisons associées
    const commandesAvecLivraison = await Promise.all(commandes.map(async (cmd) => {
      const livraison = await Livraison.findOne({ idCommande: cmd._id });
      return {
        ...cmd.toObject(),
        livraison
      };
    }));

    res.json(commandesAvecLivraison);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (boutique)
// @route   GET /api/commandes/boutique
// @desc    Obtenir les commandes reçues par une boutique
exports.getCommandesBoutique = async (req, res) => {
  try {
    const commandes = await Commande.find({ idBoutique: req.user.id })
      .populate('idAcheteur', 'nom prenom email')
      .sort('-dateCommande');

    res.json(commandes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE (admin)
// @route   GET /api/commandes/admin
// @desc    Obtenir toutes les commandes (admin)
exports.getAllCommandes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const commandes = await Commande.find()
      .populate('idBoutique', 'nomBoutique')
      .populate('idAcheteur', 'nom prenom email')
      .skip(skip)
      .limit(limit)
      .sort('-dateCommande');

    const total = await Commande.countDocuments();

    res.json({
      commandes,
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

// 🔒 ROUTE PROTÉGÉE
// @route   GET /api/commandes/:id
// @desc    Obtenir une commande par ID
exports.getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('idBoutique', 'nomBoutique telephone adresse')
      .populate('idAcheteur', 'nom prenom email telephone')
      .populate({
        path: 'articles.idProduitParBoutique',
        populate: { path: 'idProduit', select: 'nom image' }
      });

    if (!commande) {
      return res.status(404).json({ msg: 'Commande non trouvée' });
    }

    // Vérifier les permissions
    if (req.user.role === 'acheteur' && commande.idAcheteur._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé - Cette commande ne vous appartient pas' });
    }

    if (req.user.role === 'boutique' && commande.idBoutique._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé - Cette commande n\'est pas pour votre boutique' });
    }

    // Récupérer la livraison associée
    const livraison = await Livraison.findOne({ idCommande: commande._id });

    res.json({
      commande,
      livraison
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE
// @route   PUT /api/commandes/:id/statut
// @desc    Mettre à jour le statut d'une commande
exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;

    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ msg: 'Commande non trouvée' });
    }

    // Vérifier les droits
    if (req.user.role === 'boutique' && commande.idBoutique.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    // Validation du statut
    const statutsValides = ['en_attente', 'confirmée', 'préparée', 'expédiée', 'livrée', 'annulée'];
    if (!statutsValides.includes(statut)) {
      return res.status(400).json({ msg: 'Statut invalide' });
    }

    commande.statut = statut;
    await commande.save();

    // Si livrée, mettre à jour la livraison
    if (statut === 'livrée') {
      await Livraison.findOneAndUpdate(
        { idCommande: commande._id },
        {
          statut: 'livree',
          dateLivraison: new Date()
        }
      );
    }

    // Si annulée, remettre le stock
    if (statut === 'annulée') {
      for (let article of commande.articles) {
        await ProduitParBoutique.findByIdAndUpdate(
          article.idProduitParBoutique,
          { $inc: { stock: article.quantite } }
        );
      }
    }

    res.json(commande);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE
// @route   PUT /api/commandes/:id/paiement
// @desc    Mettre à jour le statut du paiement
exports.updatePaiement = async (req, res) => {
  try {
    const { paiementEffectue, modePaiement } = req.body;

    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ msg: 'Commande non trouvée' });
    }

    // Seul l'acheteur ou l'admin peut confirmer le paiement
    if (req.user.role !== 'admin' && commande.idAcheteur.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    if (paiementEffectue !== undefined) commande.paiementEffectue = paiementEffectue;
    if (modePaiement) commande.modePaiement = modePaiement;

    await commande.save();
    res.json(commande);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// 🔒 ROUTE PROTÉGÉE
// @route   PUT /api/commandes/:id/annuler
// @desc    Annuler une commande
exports.annulerCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ msg: 'Commande non trouvée' });
    }

    // Seul l'acheteur ou l'admin peut annuler
    if (req.user.role !== 'admin' && commande.idAcheteur.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    // Vérifier si la commande peut être annulée
    if (commande.statut === 'livrée' || commande.statut === 'expédiée') {
      return res.status(400).json({ msg: 'Cette commande ne peut plus être annulée' });
    }

    commande.statut = 'annulée';
    await commande.save();

    // Remettre le stock
    for (let article of commande.articles) {
      await ProduitParBoutique.findByIdAndUpdate(
        article.idProduitParBoutique,
        { $inc: { stock: article.quantite } }
      );
    }

    res.json({ msg: 'Commande annulée avec succès', commande });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};