const Acheteur = require('../models/Acheteur');
const Boutique = require('../models/Boutique');
const Transaction = require('../models/Transaction');

// --- ACHETEUR ---

// Faire un dépôt
exports.deposerArgent = async (req, res) => {
    try {
        const { montant } = req.body;
        if (!montant || montant <= 0) {
            return res.status(400).json({ msg: 'Montant invalide' });
        }

        const acheteur = await Acheteur.findById(req.user.id);
        if (!acheteur) return res.status(404).json({ msg: 'Profil acheteur non trouvé' });

        acheteur.solde += Number(montant);
        await acheteur.save();

        // Enregistrer la transaction
        const transaction = new Transaction({
            idUser: req.user.id,
            type: 'depot',
            montant: montant,
            description: `Dépôt de ${montant}€ sur le compte`
        });
        await transaction.save();

        res.json({ solde: acheteur.solde, msg: 'Dépôt réussi' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Consulter le solde (Acheteur)
exports.getSoldeAcheteur = async (req, res) => {
    try {
        const acheteur = await Acheteur.findById(req.user.id);
        if (!acheteur) return res.status(404).json({ msg: 'Acheteur non trouvé' });
        res.json({ solde: acheteur.solde });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// --- BOUTIQUE ---

// Consulter la caisse (Boutique)
exports.getCaisseBoutique = async (req, res) => {
    try {
        const boutique = await Boutique.findById(req.user.id);
        if (!boutique) return res.status(404).json({ msg: 'Boutique non trouvée' });
        res.json({ caisse: boutique.caisse });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// --- GENERAL ---

// Historique des transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ idUser: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
