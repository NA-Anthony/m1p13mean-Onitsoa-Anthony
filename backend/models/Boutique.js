const mongoose = require('mongoose');

const boutiqueSchema = new mongoose.Schema({
  nomBoutique: { type: String, required: true },
  description: String,
  adresse: String,
  telephone: String,
  logo: { type: String, default: '' },
  modePaiementAcceptes: [String],
  horaires: {
    lundi: { ouverture: String, fermeture: String },
    mardi: { ouverture: String, fermeture: String },
    mercredi: { ouverture: String, fermeture: String },
    jeudi: { ouverture: String, fermeture: String },
    vendredi: { ouverture: String, fermeture: String },
    samedi: { ouverture: String, fermeture: String },
    dimanche: { ouverture: String, fermeture: String }
  },
  noteMoyenne: { type: Number, default: 0 },
  totalAvis: { type: Number, default: 0 },
  caisse: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Boutique', boutiqueSchema);