export interface AdresseLivraison {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  }
  
  export interface Acheteur {
    _id: string;
    telephone?: string;
    adresseLivraisonParDefaut: AdresseLivraison;
    preferences: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  // Données mockées pour les tests
  export const ACHETEURS_MOCK: Acheteur[] = [
    {
      _id: '1',
      telephone: '06 12 34 56 78',
      adresseLivraisonParDefaut: {
        rue: '15 Rue de la Paix',
        ville: 'Paris',
        codePostal: '75002',
        pays: 'France'
      },
      preferences: ['Électronique', 'Livraison express', 'Paiement mobile']
    },
    {
      _id: '2',
      telephone: '07 98 76 54 32',
      adresseLivraisonParDefaut: {
        rue: '8 Avenue des Champs-Élysées',
        ville: 'Paris',
        codePostal: '75008',
        pays: 'France'
      },
      preferences: ['Mode', 'Bijoux', 'Livraison gratuite']
    },
    {
      _id: '3',
      telephone: '06 54 32 10 98',
      adresseLivraisonParDefaut: {
        rue: '25 Rue de la République',
        ville: 'Lyon',
        codePostal: '69002',
        pays: 'France'
      },
      preferences: ['Alimentation', 'Bio', 'Click & Collect']
    },
    {
      _id: '4',
      telephone: '07 11 22 33 44',
      adresseLivraisonParDefaut: {
        rue: '5 Cours Mirabeau',
        ville: 'Aix-en-Provence',
        codePostal: '13100',
        pays: 'France'
      },
      preferences: ['Livres', 'Papeterie', 'Cadeaux']
    }
  ];
  
  // Liste des préférences disponibles
  export const PREFERENCES_DISPONIBLES = [
    'Électronique',
    'Mode',
    'Alimentation',
    'Livres',
    'Bijoux',
    'Sport',
    'Maison',
    'Jardin',
    'Beauté',
    'Santé',
    'Auto-moto',
    'Informatique',
    'Téléphonie',
    'Jeux vidéo',
    'Musique',
    'Cinéma',
    'Animaux',
    'Bébé',
    'Livraison express',
    'Livraison gratuite',
    'Click & Collect',
    'Paiement mobile',
    'Paiement à la livraison',
    'Bio',
    'Artisanat',
    'Made in France',
    'Cadeaux',
    'Papeterie'
  ];