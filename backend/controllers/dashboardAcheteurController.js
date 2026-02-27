const Commande = require('../models/Commande');
const Avis = require('../models/Avis');
const ProduitParBoutique = require('../models/ProduitParBoutique');
const Boutique = require('../models/Boutique');
const Acheteur = require('../models/Acheteur');

// @route   GET /api/dashboard-acheteur/stats
// @desc    Récupérer toutes les statistiques pour le dashboard acheteur
exports.getDashboardStats = async (req, res) => {
  try {
    const acheteurId = req.user.id;

    // Récupérer les informations de l'acheteur
    const acheteur = await Acheteur.findById(acheteurId);

    // Statistiques des commandes
    const commandes = await Commande.find({ idAcheteur: acheteurId })
      .populate('idBoutique', 'nomBoutique logo')
      .populate({
        path: 'articles.idProduitParBoutique',
        populate: { path: 'idProduit', select: 'nom image' }
      })
      .sort('-dateCommande');

    const totalCommandes = commandes.length;
    const totalDepenses = commandes.reduce((acc, c) => acc + c.total, 0);
    
    // Commandes en cours (non livrées et non annulées)
    const commandesEnCours = commandes.filter(c => 
      !['livrée', 'annulée'].includes(c.statut)
    ).length;

    // Commandes livrées
    const commandesLivrees = commandes.filter(c => c.statut === 'livrée').length;

    // Dernières commandes (5 dernières)
    const dernieresCommandes = commandes.slice(0, 5).map(c => ({
      _id: c._id,
      dateCommande: c.dateCommande,
      total: c.total,
      statut: c.statut,
      boutique: c.idBoutique,
      articles: c.articles.length
    }));

    // Statistiques des avis
    const avis = await Avis.find({ idAcheteur: acheteurId })
      .populate({
        path: 'idProduitParBoutique',
        populate: { path: 'idProduit', select: 'nom image' }
      })
      .populate({
        path: 'idProduitParBoutique',
        populate: { path: 'idBoutique', select: 'nomBoutique' }
      })
      .sort('-createdAt');

    const totalAvis = avis.length;
    
    // Derniers avis (3 derniers)
    const derniersAvis = avis.slice(0, 3).map(a => ({
      _id: a._id,
      note: a.note,
      commentaire: a.commentaire,
      createdAt: a.createdAt,
      reponseBoutique: a.reponseBoutique,
      produit: a.idProduitParBoutique?.idProduit,
      boutique: a.idProduitParBoutique?.idBoutique
    }));

    // Recommandations (produits populaires basés sur les achats précédents)
    // Récupérer les catégories préférées de l'acheteur
    const categoriesPreferees = [];
    const produitsAchetes = new Set();
    
    commandes.forEach(c => {
      c.articles.forEach(a => {
        if (a.idProduitParBoutique?.idProduit?.categorie) {
          categoriesPreferees.push(a.idProduitParBoutique.idProduit.categorie);
        }
        if (a.idProduitParBoutique?.idProduit?._id) {
          produitsAchetes.add(a.idProduitParBoutique.idProduit._id.toString());
        }
      });
    });

    // Compter les catégories
    const frequenceCategories = {};
    categoriesPreferees.forEach(cat => {
      frequenceCategories[cat] = (frequenceCategories[cat] || 0) + 1;
    });

    // Trier les catégories par fréquence
    const categoriesTriees = Object.keys(frequenceCategories)
      .sort((a, b) => frequenceCategories[b] - frequenceCategories[a]);

    const categorieFavorite = categoriesTriees[0] || null;

    // Récupérer des produits recommandés (même catégorie, pas déjà achetés)
    let recommandations = [];
    if (categorieFavorite) {
      // Trouver des produits de la même catégorie
      const produitsRecommandes = await ProduitParBoutique.find()
        .populate({
          path: 'idProduit',
          match: { 
            categorie: categorieFavorite,
            _id: { $nin: Array.from(produitsAchetes) }
          }
        })
        .populate('idBoutique', 'nomBoutique')
        .limit(5);

      recommandations = produitsRecommandes
        .filter(p => p.idProduit) // Garder seulement ceux qui ont un produit
        .map(p => ({
          _id: p._id,
          nom: p.idProduit?.nom,
          prix: p.prix,
          image: p.idProduit?.image,
          categorie: p.idProduit?.categorie,
          boutique: p.idBoutique?.nomBoutique,
          enPromotion: p.enPromotion,
          prixPromo: p.prixPromo
        }));
    }

    // Si pas assez de recommandations, ajouter des produits populaires
    if (recommandations.length < 3) {
      const produitsPopulaires = await ProduitParBoutique.find()
        .populate('idProduit')
        .populate('idBoutique', 'nomBoutique')
        .limit(5 - recommandations.length);

      produitsPopulaires.forEach(p => {
        if (p.idProduit && !produitsAchetes.has(p.idProduit._id.toString())) {
          recommandations.push({
            _id: p._id,
            nom: p.idProduit?.nom,
            prix: p.prix,
            image: p.idProduit?.image,
            categorie: p.idProduit?.categorie,
            boutique: p.idBoutique?.nomBoutique,
            enPromotion: p.enPromotion,
            prixPromo: p.prixPromo
          });
        }
      });
    }

    // Statistiques des dépenses par mois (6 derniers mois)
    const aujourdHui = new Date();
    const depensesParMois = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(aujourdHui);
      date.setMonth(date.getMonth() - i);
      const mois = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      const debutMois = new Date(date.getFullYear(), date.getMonth(), 1);
      const finMois = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const depensesMois = commandes
        .filter(c => {
          const dateCommande = new Date(c.dateCommande);
          return dateCommande >= debutMois && dateCommande <= finMois;
        })
        .reduce((acc, c) => acc + c.total, 0);
      
      depensesParMois.push({
        mois,
        total: depensesMois
      });
    }

    res.json({
      acheteur: {
        telephone: acheteur?.telephone,
        adresse: acheteur?.adresseLivraisonParDefaut
      },
      stats: {
        commandes: {
          total: totalCommandes,
          enCours: commandesEnCours,
          livrees: commandesLivrees,
          totalDepenses,
          dernieres: dernieresCommandes,
          depensesParMois
        },
        avis: {
          total: totalAvis,
          derniers: derniersAvis
        },
        recommandations: recommandations.slice(0, 4)
      }
    });

  } catch (err) {
    console.error('Erreur dashboard acheteur:', err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// @route   GET /api/dashboard-acheteur/commandes
// @desc    Récupérer toutes les commandes de l'acheteur avec pagination
exports.getCommandes = async (req, res) => {
  try {
    const acheteurId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const commandes = await Commande.find({ idAcheteur: acheteurId })
      .populate('idBoutique', 'nomBoutique logo')
      .populate({
        path: 'articles.idProduitParBoutique',
        populate: { path: 'idProduit', select: 'nom image' }
      })
      .skip(skip)
      .limit(limit)
      .sort('-dateCommande');

    const total = await Commande.countDocuments({ idAcheteur: acheteurId });

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

// @route   GET /api/dashboard-acheteur/avis
// @desc    Récupérer tous les avis de l'acheteur avec pagination
exports.getAvis = async (req, res) => {
  try {
    const acheteurId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const avis = await Avis.find({ idAcheteur: acheteurId })
      .populate({
        path: 'idProduitParBoutique',
        populate: { path: 'idProduit', select: 'nom image' }
      })
      .populate({
        path: 'idProduitParBoutique',
        populate: { path: 'idBoutique', select: 'nomBoutique' }
      })
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await Avis.countDocuments({ idAcheteur: acheteurId });

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