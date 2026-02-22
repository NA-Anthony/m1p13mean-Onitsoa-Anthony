import { Produit } from '../produit/produit.model';
import { Boutique } from '../boutique/boutique.model';

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
  boutique?: Boutique;
  produit?: Produit;
}

export const PRODUITS_PAR_BOUTIQUE_MOCK: ProduitParBoutique[] = [
  {
    _id: '1',
    idBoutique: '1',
    idProduit: '1',
    prix: 899.99,
    stock: 15,
    enPromotion: true,
    prixPromo: 799.99
  },
  {
    _id: '2',
    idBoutique: '1',
    idProduit: '2',
    prix: 49.99,
    stock: 8,
    enPromotion: false
  },
  {
    _id: '3',
    idBoutique: '2',
    idProduit: '3',
    prix: 3.99,
    stock: 150,
    enPromotion: true,
    prixPromo: 2.99
  },
  {
    _id: '4',
    idBoutique: '2',
    idProduit: '4',
    prix: 399.99,
    stock: 3,
    enPromotion: false
  },
  {
    _id: '5',
    idBoutique: '3',
    idProduit: '5',
    prix: 29.99,
    stock: 0,
    enPromotion: false
  }
];

// Données mockées pour les boutiques et produits (pour l'affichage)
import { BOUTIQUES_MOCK } from '../boutique/boutique.model';
import { PRODUITS_MOCK } from '../produit/produit.model';

// Simuler les données populées
export const PRODUITS_PAR_BOUTIQUE_POPULED = PRODUITS_PAR_BOUTIQUE_MOCK.map(item => ({
  ...item,
  boutique: BOUTIQUES_MOCK.find(b => b._id === item.idBoutique),
  produit: PRODUITS_MOCK.find(p => p._id === item.idProduit)
}));