const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  idAcheteur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  idBoutique: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Boutique',
    required: true 
  },
  dateCommande: { type: Date, default: Date.now },
  statut: { 
    type: String, 
    enum: ['en_attente', 'confirmée', 'préparée', 'expédiée', 'livrée', 'annulée'],
    default: 'en_attente'
  },
  articles: [{
    idProduitParBoutique: { type: mongoose.Schema.Types.ObjectId, ref: 'ProduitParBoutique' },
    nomProduit: String,
    prixUnitaire: Number,
    quantite: { type: Number, min: 1 },
    remise: { type: Number, default: 0 }
  }],
  adresseLivraison: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: String
  },
  fraisLivraison: { type: Number, default: 0 },
  total: { type: Number, required: true },
  modePaiement: String,
  paiementEffectue: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Commande', commandeSchema);