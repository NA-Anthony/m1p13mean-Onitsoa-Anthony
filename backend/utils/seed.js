const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../connexion');
const User = require('../models/User');
const Boutique = require('../models/Boutique');
const Acheteur = require('../models/Acheteur');
const Produit = require('../models/Produit');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Nettoyer la base
    await User.deleteMany({});
    await Boutique.deleteMany({});
    await Acheteur.deleteMany({});
    await Produit.deleteMany({});

    console.log('🧹 Base nettoyée');

    // Créer Admin
    const admin = new User({
      nom: 'Admin',
      prenom: 'System',
      email: 'admin@centrecommercial.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin créé');

    // Créer Boutiques
    const boutique1 = new User({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'contact@techzone.fr',
      password: 'boutique123',
      role: 'boutique'
    });
    await boutique1.save();

    await Boutique.create({
      _id: boutique1._id,
      nomBoutique: 'TechZone',
      description: 'Vente de produits électroniques et high-tech',
      adresse: '15 rue de la Paix, Paris',
      telephone: '0123456789',
      modePaiementAcceptes: ['carte', 'espèces']
    });
    console.log('✅ Boutique TechZone créée');

    const boutique2 = new User({
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'contact@modamix.fr',
      password: 'boutique123',
      role: 'boutique'
    });
    await boutique2.save();

    await Boutique.create({
      _id: boutique2._id,
      nomBoutique: 'ModaMix',
      description: 'Vêtements tendance pour toute la famille',
      adresse: '8 rue du Commerce, Lyon',
      telephone: '0987654321',
      modePaiementAcceptes: ['carte', 'mobile money']
    });
    console.log('✅ Boutique ModaMix créée');

    // Créer Acheteurs
    const acheteur1 = new User({
      nom: 'Durand',
      prenom: 'Marie',
      email: 'marie.durand@email.com',
      password: 'acheteur123',
      role: 'acheteur'
    });
    await acheteur1.save();

    await Acheteur.create({
      _id: acheteur1._id,
      telephone: '0612345678',
      adresseLivraisonParDefaut: {
        rue: '23 avenue Victor Hugo',
        ville: 'Paris',
        codePostal: '75016',
        pays: 'France'
      },
      preferences: ['electronique', 'mode']
    });
    console.log('✅ Acheteur Marie créé');

    // Créer Produits
    const produits = [
      {
        nom: 'iPhone 13',
        description: 'Smartphone Apple 128Go',
        categorie: 'electronique',
        image: 'iphone13.jpg',
        caracteristiques: { couleur: 'noir', stockage: '128Go' }
      },
      {
        nom: 'MacBook Pro',
        description: 'Ordinateur portable 14 pouces',
        categorie: 'electronique',
        image: 'macbook.jpg',
        caracteristiques: { processeur: 'M2', ram: '16Go' }
      },
      {
        nom: 'Jean slim',
        description: 'Jean coupe slim homme',
        categorie: 'habillement',
        image: 'jean.jpg',
        caracteristiques: { matiere: 'coton', taille: '40' }
      },
      {
        nom: 'Robe d\'été',
        description: 'Robe légère imprimée',
        categorie: 'habillement',
        image: 'robe.jpg',
        caracteristiques: { matiere: 'coton', taille: 'M' }
      }
    ];

    await Produit.insertMany(produits);
    console.log('✅ Produits créés');

    console.log('\n🎉 Base de données initialisée avec succès !');
    console.log('\n📝 Identifiants de test :');
    console.log('Admin    : admin@centrecommercial.com / admin123');
    console.log('Boutique : contact@techzone.fr / boutique123');
    console.log('Boutique : contact@modamix.fr / boutique123');
    console.log('Acheteur : marie.durand@email.com / acheteur123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seed:', error);
    process.exit(1);
  }
};

seedDatabase();