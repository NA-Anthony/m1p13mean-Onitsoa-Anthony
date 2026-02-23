export interface ProduitParBoutique {
  _id: string;
  idBoutique: string;
  idProduit: string;
  prix: number;
  stock: number;
  enPromotion: boolean;
  prixPromo?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Champs populés pour l'affichage
  boutique?: {
    _id: string;
    nomBoutique: string;
    adresse?: string;
    telephone?: string;
    logo?: string;
  };
  produit?: {
    _id: string;
    nom: string;
    description?: string;
    categorie: string;
    image?: string;
  };
}

export const CATEGORIES_PRODUIT = [
  { value: 'alimentaire', label: 'Alimentaire', icon: 'cil-basket' },
  { value: 'habillement', label: 'Habillement', icon: 'cil-shirt' },
  { value: 'electronique', label: 'Électronique', icon: 'cil-laptop' },
  { value: 'maison', label: 'Maison', icon: 'cil-home' },
  { value: 'autre', label: 'Autre', icon: 'cil-star' }
];