const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  idProduitParBoutique: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ProduitParBoutique',
    required: true 
  },
  remisePourcentage: { type: Number, required: true, min: 1, max: 100 },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);