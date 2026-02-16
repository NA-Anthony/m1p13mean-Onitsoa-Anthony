const mongoose = require('mongoose');

const livraisonSchema = new mongoose.Schema({
  idCommande: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Commande',
    required: true 
  },
  statut: { 
    type: String, 
    enum: ['en_attente', 'en_cours', 'livree'],
    default: 'en_attente'
  },
  livreur: String,
  numeroSuivi: String,
  dateEstimee: Date,
  dateLivraison: Date
}, { timestamps: true });

module.exports = mongoose.model('Livraison', livraisonSchema);