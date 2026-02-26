const User = require('../models/User');
const Boutique = require('../models/Boutique');
const Produit = require('../models/Produit');
const Commande = require('../models/Commande');
const Avis = require('../models/Avis');
const Promotion = require('../models/Promotion');

// @route   GET /api/dashboard-admin/stats
// @desc    Récupérer toutes les statistiques pour le dashboard admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalBoutiques = await User.countDocuments({ role: 'boutique' });
    const totalAcheteurs = await User.countDocuments({ role: 'acheteur' });
    const usersActifs = await User.countDocuments({ actif: true });

    // Statistiques des boutiques
    const totalBoutiquesProfil = await Boutique.countDocuments();
    const boutiquesAvecAvis = await Boutique.countDocuments({ totalAvis: { $gt: 0 } });
    
    // Note moyenne globale des boutiques
    const noteMoyenneResult = await Boutique.aggregate([
      { $group: { _id: null, moyenne: { $avg: '$noteMoyenne' } } }
    ]);
    const noteMoyenneGlobale = noteMoyenneResult[0]?.moyenne || 0;

    // Statistiques des produits
    const totalProduits = await Produit.countDocuments();
    
    // Répartition par catégorie
    const produitsParCategorie = await Produit.aggregate([
      { $group: { _id: '$categorie', count: { $sum: 1 } } }
    ]);

    // Statistiques des commandes
    const totalCommandes = await Commande.countDocuments();
    const commandesParStatut = await Commande.aggregate([
      { $group: { _id: '$statut', count: { $sum: 1 } } }
    ]);
    
    // Chiffre d'affaires total
    const caResult = await Commande.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const chiffreAffairesTotal = caResult[0]?.total || 0;

    // Commandes par mois (6 derniers mois)
    const aujourdHui = new Date();
    const commandesParMois = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(aujourdHui);
      date.setMonth(date.getMonth() - i);
      const mois = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      const debutMois = new Date(date.getFullYear(), date.getMonth(), 1);
      const finMois = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const commandesMois = await Commande.countDocuments({
        dateCommande: { $gte: debutMois, $lte: finMois }
      });
      
      const caMois = await Commande.aggregate([
        {
          $match: {
            dateCommande: { $gte: debutMois, $lte: finMois }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);
      
      commandesParMois.push({
        mois,
        commandes: commandesMois,
        ca: caMois[0]?.total || 0
      });
    }

    // Statistiques des avis
    const totalAvis = await Avis.countDocuments();
    const avisAvecReponse = await Avis.countDocuments({ reponseBoutique: { $exists: true } });
    
    // Répartition des notes
    const repartitionNotes = await Avis.aggregate([
      { $group: { _id: '$note', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Statistiques des promotions
    const totalPromotions = await Promotion.countDocuments();
    const promotionsActives = await Promotion.countDocuments({ 
      actif: true,
      dateDebut: { $lte: new Date() },
      dateFin: { $gte: new Date() }
    });

    // Top 5 boutiques par note
    const topBoutiques = await Boutique.find()
      .sort({ noteMoyenne: -1, totalAvis: -1 })
      .limit(5)
      .select('nomBoutique noteMoyenne totalAvis logo');

    // Dernières commandes (10 dernières)
    const dernieresCommandes = await Commande.find()
      .populate('idBoutique', 'nomBoutique')
      .populate('idAcheteur', 'nom prenom')
      .sort('-dateCommande')
      .limit(10);

    res.json({
      users: {
        total: totalUsers,
        admins: totalAdmins,
        boutiques: totalBoutiques,
        acheteurs: totalAcheteurs,
        actifs: usersActifs
      },
      boutiques: {
        total: totalBoutiquesProfil,
        avecAvis: boutiquesAvecAvis,
        noteMoyenne: Math.round(noteMoyenneGlobale * 10) / 10,
        topBoutiques
      },
      produits: {
        total: totalProduits,
        parCategorie: produitsParCategorie
      },
      commandes: {
        total: totalCommandes,
        parStatut: commandesParStatut,
        chiffreAffaires: chiffreAffairesTotal,
        parMois: commandesParMois,
        dernieres: dernieresCommandes
      },
      avis: {
        total: totalAvis,
        avecReponse: avisAvecReponse,
        repartitionNotes
      },
      promotions: {
        total: totalPromotions,
        actives: promotionsActives
      }
    });

  } catch (err) {
    console.error('Erreur dashboard admin:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// @route   GET /api/dashboard-admin/top-boutiques
// @desc    Récupérer le top 10 des boutiques
exports.getTopBoutiques = async (req, res) => {
  try {
    const boutiques = await Boutique.find()
      .sort({ noteMoyenne: -1, totalAvis: -1 })
      .limit(10)
      .select('nomBoutique noteMoyenne totalAvis logo description');

    res.json(boutiques);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   GET /api/dashboard-admin/commandes-recentes
// @desc    Récupérer les 20 dernières commandes
exports.getCommandesRecentes = async (req, res) => {
  try {
    const commandes = await Commande.find()
      .populate('idBoutique', 'nomBoutique')
      .populate('idAcheteur', 'nom prenom telephone')
      .sort('-dateCommande')
      .limit(20);

    res.json(commandes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   GET /api/dashboard-admin/evolution
// @desc    Récupérer l'évolution des inscriptions et commandes
exports.getEvolution = async (req, res) => {
  try {
    const maintenant = new Date();
    const evolution = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(maintenant);
      date.setMonth(date.getMonth() - i);
      const mois = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      const debutMois = new Date(date.getFullYear(), date.getMonth(), 1);
      const finMois = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const nouveauxUsers = await User.countDocuments({
        dateCreation: { $gte: debutMois, $lte: finMois }
      });

      const nouvellesCommandes = await Commande.countDocuments({
        dateCommande: { $gte: debutMois, $lte: finMois }
      });

      evolution.push({
        mois,
        users: nouveauxUsers,
        commandes: nouvellesCommandes
      });
    }

    res.json(evolution);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};