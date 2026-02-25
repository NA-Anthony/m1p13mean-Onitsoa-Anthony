const Commande = require('../models/Commande');
const ProduitParBoutique = require('../models/ProduitParBoutique');
const Avis = require('../models/Avis');
const Promotion = require('../models/Promotion');
const Boutique = require('../models/Boutique');

// @route   GET /api/dashboard/boutique/stats
// @desc    Récupérer toutes les statistiques pour le dashboard boutique
exports.getDashboardStats = async (req, res) => {
  try {
    const boutiqueId = req.user.id;

    // Récupérer les informations de la boutique
    const boutique = await Boutique.findById(boutiqueId)
      .populate('_id', 'nom prenom email photo');

    // Statistiques des produits
    const produits = await ProduitParBoutique.find({ idBoutique: boutiqueId })
      .populate('idProduit');
    
    const totalProduits = produits.length;
    const valeurStock = produits.reduce((acc, p) => {
      const prix = p.enPromotion && p.prixPromo ? p.prixPromo : p.prix;
      return acc + (prix * p.stock);
    }, 0);

    // Produits en stock faible (< 5)
    const stockFaible = produits
      .filter(p => p.stock > 0 && p.stock < 5)
      .map(p => ({
        _id: p._id,
        nom: p.idProduit?.nom,
        stock: p.stock,
        prix: p.prix,
        image: p.idProduit?.image
      }))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    // Statistiques des commandes
    const commandes = await Commande.find({ idBoutique: boutiqueId })
      .populate('idAcheteur', 'nom prenom telephone')
      .sort('-dateCommande');

    const totalCommandes = commandes.length;
    const chiffreAffaires = commandes.reduce((acc, c) => acc + c.total, 0);
    
    // Commandes par statut
    const commandesParStatut = {
      en_attente: commandes.filter(c => c.statut === 'en_attente').length,
      confirmée: commandes.filter(c => c.statut === 'confirmée').length,
      préparée: commandes.filter(c => c.statut === 'préparée').length,
      expédiée: commandes.filter(c => c.statut === 'expédiée').length,
      livrée: commandes.filter(c => c.statut === 'livrée').length,
      annulée: commandes.filter(c => c.statut === 'annulée').length
    };

    // Dernières commandes
    const dernieresCommandes = commandes.slice(0, 5).map(c => ({
      _id: c._id,
      dateCommande: c.dateCommande,
      total: c.total,
      statut: c.statut,
      acheteur: c.idAcheteur
    }));

    // Ventes des 7 derniers jours
    const aujourdHui = new Date();
    const ventes7Jours = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(aujourdHui);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateSuivante = new Date(date);
      dateSuivante.setDate(dateSuivante.getDate() + 1);
      
      const ventesJour = commandes
        .filter(c => {
          const dateCommande = new Date(c.dateCommande);
          return dateCommande >= date && dateCommande < dateSuivante;
        })
        .reduce((acc, c) => acc + c.total, 0);
      
      ventes7Jours.push({
        date: date.toLocaleDateString('fr-FR'),
        total: ventesJour
      });
    }

    // Statistiques des avis
    // Récupérer tous les produits de la boutique
    const idsProduits = produits.map(p => p._id);
    
    const avis = await Avis.find({ 
      idProduitParBoutique: { $in: idsProduits } 
    })
      .populate('idAcheteur', 'nom prenom photo')
      .populate({
        path: 'idProduitParBoutique',
        populate: { path: 'idProduit', select: 'nom image' }
      })
      .sort('-createdAt');

    const totalAvis = avis.length;
    
    let noteMoyenne = 0;
    const repartitionNotes = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (totalAvis > 0) {
      const sommeNotes = avis.reduce((acc, a) => acc + a.note, 0);
      noteMoyenne = sommeNotes / totalAvis;
      
      avis.forEach(a => {
        repartitionNotes[a.note] = (repartitionNotes[a.note] || 0) + 1;
      });
    }

    // Derniers avis
    const derniersAvis = avis.slice(0, 3).map(a => ({
      _id: a._id,
      note: a.note,
      commentaire: a.commentaire,
      createdAt: a.createdAt,
      reponseBoutique: a.reponseBoutique,
      acheteur: a.idAcheteur,
      produit: a.idProduitParBoutique?.idProduit
    }));

    // Statistiques des promotions
    const promotions = await Promotion.find({
      idProduitParBoutique: { $in: idsProduits },
      actif: true,
      dateDebut: { $lte: new Date() },
      dateFin: { $gte: new Date() }
    }).populate({
      path: 'idProduitParBoutique',
      populate: { path: 'idProduit', select: 'nom' }
    });

    const totalPromotions = promotions.length;
    const promotionsActives = promotions.slice(0, 3).map(p => ({
      _id: p._id,
      remisePourcentage: p.remisePourcentage,
      dateDebut: p.dateDebut,
      dateFin: p.dateFin,
      produit: p.idProduitParBoutique?.idProduit
    }));

    res.json({
      boutique: {
        id: boutiqueId,
        nom: boutique?.nomBoutique,
        logo: boutique?.logo
      },
      stats: {
        produits: {
          total: totalProduits,
          valeurStock,
          stockFaible
        },
        commandes: {
          total: totalCommandes,
          chiffreAffaires,
          parStatut: commandesParStatut,
          dernieres: dernieresCommandes,
          ventes7Jours
        },
        avis: {
          total: totalAvis,
          noteMoyenne: Math.round(noteMoyenne * 10) / 10,
          repartition: repartitionNotes,
          derniers: derniersAvis
        },
        promotions: {
          total: totalPromotions,
          actives: promotionsActives
        }
      }
    });

  } catch (err) {
    console.error('Erreur dashboard boutique:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// @route   GET /api/dashboard/boutique/commandes
// @desc    Récupérer toutes les commandes avec pagination
exports.getCommandes = async (req, res) => {
  try {
    const boutiqueId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const commandes = await Commande.find({ idBoutique: boutiqueId })
      .populate('idAcheteur', 'nom prenom telephone')
      .skip(skip)
      .limit(limit)
      .sort('-dateCommande');

    const total = await Commande.countDocuments({ idBoutique: boutiqueId });

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

// @route   GET /api/dashboard/boutique/produits
// @desc    Récupérer tous les produits avec stock
exports.getProduits = async (req, res) => {
  try {
    const boutiqueId = req.user.id;

    const produits = await ProduitParBoutique.find({ idBoutique: boutiqueId })
      .populate('idProduit')
      .sort('-createdAt');

    res.json(produits);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   GET /api/dashboard/boutique/avis
// @desc    Récupérer tous les avis avec pagination
exports.getAvis = async (req, res) => {
  try {
    const boutiqueId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Récupérer tous les produits de la boutique
    const produits = await ProduitParBoutique.find({ idBoutique: boutiqueId })
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

    res.json({
      avis,
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