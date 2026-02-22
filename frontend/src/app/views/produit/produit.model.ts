export interface Produit {
  _id: string;
  nom: string;
  description?: string;
  categorie: 'alimentaire' | 'habillement' | 'electronique' | 'maison' | 'autre';
  image?: string;
  datePeremption?: Date;
  caracteristiques?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export const PRODUITS_MOCK: Produit[] = [
  {
    _id: '1',
    nom: 'Smartphone Galaxy S23',
    description: 'Smartphone dernière génération avec écran AMOLED 120Hz, processeur ultra-rapide et appareil photo professionnel.',
    categorie: 'electronique',
    image: 'assets/images/products/phone.jpg',
    caracteristiques: { 
      marque: 'Samsung', 
      ram: '8GB', 
      stockage: '256GB',
      couleur: 'Noir'
    }
  },
  {
    _id: '2',
    nom: 'Jean slim noir',
    description: 'Jean slim en coton bio, coupe moderne et confortable, idéal pour toutes les occasions.',
    categorie: 'habillement',
    image: 'assets/images/products/jean.jpg',
    caracteristiques: { 
      taille: 'M', 
      matière: 'Coton', 
      couleur: 'Noir',
      marque: 'Levi\'s'
    }
  },
  {
    _id: '3',
    nom: 'Pâtes bio complètes',
    description: 'Pâtes complètes bio, riches en fibres, pack de 500g. Idéal pour une alimentation saine.',
    categorie: 'alimentaire',
    image: 'assets/images/products/pates.jpg',
    datePeremption: new Date('2025-12-31'),
    caracteristiques: { 
      marque: 'BioVillage', 
      poids: '500g',
      type: 'Complètes',
      bio: true
    }
  },
  {
    _id: '4',
    nom: 'Canapé 3 places',
    description: 'Canapé design confortable en tissu, idéal pour votre salon.',
    categorie: 'maison',
    image: 'assets/images/products/canape.jpg',
    caracteristiques: { 
      couleur: 'Gris', 
      matière: 'Tissu',
      places: 3,
      dimensions: '200x90x85cm'
    }
  },
  {
    _id: '5',
    nom: 'Sac à dos urbain',
    description: 'Sac à dos imperméable avec compartiment pour ordinateur 15 pouces.',
    categorie: 'autre',
    image: 'assets/images/products/sac.jpg',
    caracteristiques: { 
      couleur: 'Noir', 
      capacité: '25L',
      marque: 'UrbanStyle'
    }
  }
];

export const CATEGORIES_PRODUIT = [
  { value: 'alimentaire', label: 'Alimentaire', icon: 'cil-basket' },
  { value: 'habillement', label: 'Habillement', icon: 'cil-shirt' },
  { value: 'electronique', label: 'Électronique', icon: 'cil-laptop' },
  { value: 'maison', label: 'Maison', icon: 'cil-home' },
  { value: 'autre', label: 'Autre', icon: 'cil-star' }
];