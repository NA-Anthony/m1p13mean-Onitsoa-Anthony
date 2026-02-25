const Promotion = require('../models/Promotion');
const ProduitParBoutique = require('../models/ProduitParBoutique');

// @route   POST /api/produits/boutique/:id/promotion
// @desc    Ajouter une promotion avec gestion intelligente
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
    const maintenant = new Date();

    if (fin <= debut) {
      return res.status(400).json({ msg: 'La date de fin doit être après la date de début' });
    }

    // Chercher les promotions existantes qui se chevauchent
    const promotionsExistantes = await Promotion.find({
      idProduitParBoutique: produitId,
      $or: [
        // Promotion existante qui chevauche la nouvelle
        {
          dateDebut: { $lte: fin },
          dateFin: { $gte: debut }
        }
      ]
    });

    let message = '';

    if (promotionsExistantes.length > 0) {
      // Désactiver toutes les promotions existantes
      await Promotion.updateMany(
        { idProduitParBoutique: produitId },
        { actif: false }
      );
      
      message = `${promotionsExistantes.length} promotion(s) existante(s) ont été désactivées. `;
    }

    // Déterminer si la nouvelle promotion doit être active
    const estActive = maintenant >= debut && maintenant <= fin;

    // Créer la nouvelle promotion
    const nouvellePromotion = new Promotion({
      idProduitParBoutique: produitId,
      remisePourcentage,
      dateDebut: debut,
      dateFin: fin,
      actif: estActive
    });

    await nouvellePromotion.save();

    // Mettre à jour le produit
    produit.enPromotion = estActive;
    if (estActive) {
      produit.prixPromo = produit.prix * (1 - remisePourcentage / 100);
    }
    await produit.save();

    message += estActive 
      ? 'Nouvelle promotion activée car elle est en cours.'
      : 'Nouvelle promotion programmée pour plus tard.';

    // Retourner le produit mis à jour avec sa promotion
    const produitMisAJour = await ProduitParBoutique.findById(produitId)
      .populate('idProduit')
      .populate('idBoutique');

    res.json({
      produit: produitMisAJour,
      message,
      nouvellePromotion
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   DELETE /api/produits/boutique/:id/promotion
// @desc    Supprimer la promotion active
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

    // Désactiver toutes les promotions
    await Promotion.updateMany(
      { idProduitParBoutique: produitId },
      { actif: false }
    );

    // Mettre à jour le produit
    produit.enPromotion = false;
    produit.prixPromo = undefined;
    await produit.save();

    // Chercher s'il y a une autre promotion programmée
    const prochainePromotion = await Promotion.findOne({
      idProduitParBoutique: produitId,
      dateDebut: { $gt: new Date() }
    }).sort({ dateDebut: 1 });

    let message = 'Promotion supprimée.';

    if (prochainePromotion) {
      message += ` Une prochaine promotion est programmée pour le ${new Date(prochainePromotion.dateDebut).toLocaleDateString()}.`;
    }

    const produitMisAJour = await ProduitParBoutique.findById(produitId)
      .populate('idProduit')
      .populate('idBoutique');

    res.json({
      produit: produitMisAJour,
      message
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   GET /api/produits/boutique/:id/promotions
// @desc    Obtenir l'historique des promotions d'un produit
exports.getHistoriquePromotions = async (req, res) => {
  try {
    const produitId = req.params.id;

    const promotions = await Promotion.find({ idProduitParBoutique: produitId })
      .sort({ dateDebut: -1 });

    res.json(promotions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};