const mongoose = require('mongoose');

const acheteurSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  telephone: String,
  adresseLivraisonParDefaut: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: { type: String, default: 'France' }
  },
  preferences: [String]
}, { timestamps: true });

module.exports = mongoose.model('Acheteur', acheteurSchema);