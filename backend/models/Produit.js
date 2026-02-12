const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  categorie: { 
    type: String, 
    enum: ['alimentaire', 'habillement', 'electronique', 'maison', 'autre'],
    required: true 
  },
  image: String,
  datePeremption: Date,
  caracteristiques: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Produit', produitSchema);