const mongoose = require('mongoose');

const tarifLivraisonSchema = new mongoose.Schema({
  idBoutique: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Boutique',
    required: true,
    unique: true 
  },
  tarifs: [{
    distanceMin: Number,
    distanceMax: Number,
    prix: Number
  }],
  zoneGratuite: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TarifLivraison', tarifLivraisonSchema);