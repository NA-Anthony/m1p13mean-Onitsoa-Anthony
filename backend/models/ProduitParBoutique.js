const mongoose = require('mongoose');

const produitParBoutiqueSchema = new mongoose.Schema({
  idBoutique: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Boutique',
    required: true 
  },
  idProduit: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Produit',
    required: true 
  },
  prix: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  enPromotion: { type: Boolean, default: false },
  prixPromo: Number
}, { timestamps: true });

// Un produit ne peut être ajouté qu'une fois par boutique
produitParBoutiqueSchema.index({ idBoutique: 1, idProduit: 1 }, { unique: true });

module.exports = mongoose.model('ProduitParBoutique', produitParBoutiqueSchema);