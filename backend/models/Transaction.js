const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['depot', 'achat', 'vente', 'retrait'],
        required: true
    },
    montant: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: String,
    idCommande: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande' },
    statut: { type: String, enum: ['succes', 'echec', 'en_attente'], default: 'succes' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
