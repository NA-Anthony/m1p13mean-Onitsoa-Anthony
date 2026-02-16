const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  idAcheteur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  idProduitParBoutique: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ProduitParBoutique',
    required: true 
  },
  note: { type: Number, required: true, min: 1, max: 5 },
  commentaire: String,
  reponseBoutique: {
    commentaire: String,
    date: Date
  }
}, { timestamps: true });

// Un acheteur ne peut laisser qu'un avis par produit
avisSchema.index({ idAcheteur: 1, idProduitParBoutique: 1 }, { unique: true });

module.exports = mongoose.model('Avis', avisSchema);