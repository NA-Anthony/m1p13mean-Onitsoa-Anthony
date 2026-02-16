const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'boutique', 'acheteur'],
    required: true 
  },
  photo: { type: String, default: '' },
  dateCreation: { type: Date, default: Date.now },
  actif: { type: Boolean, default: true }
});

// ✅ CORRECTION ICI : Plus de paramètre 'next'
userSchema.pre('save', async function() {
  // Ne hasher que si le mot de passe est modifié
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error('Erreur lors du hashage du mot de passe');
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);