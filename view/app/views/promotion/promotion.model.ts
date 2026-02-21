import { ProduitParBoutique } from '../produit-par-boutique/produit-par-boutique.model';

export interface Promotion {
  _id: string;
  idProduitParBoutique: string;
  remisePourcentage: number;
  dateDebut: Date;
  dateFin: Date;
  actif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Champs populés
  produitParBoutique?: ProduitParBoutique;
}

export const PROMOTIONS_MOCK: Promotion[] = [
  {
    _id: '1',
    idProduitParBoutique: '1',
    remisePourcentage: 15,
    dateDebut: new Date('2024-03-01'),
    dateFin: new Date('2024-04-01'),
    actif: true
  },
  {
    _id: '2',
    idProduitParBoutique: '3',
    remisePourcentage: 25,
    dateDebut: new Date('2024-03-15'),
    dateFin: new Date('2024-03-30'),
    actif: true
  },
  {
    _id: '3',
    idProduitParBoutique: '1',
    remisePourcentage: 10,
    dateDebut: new Date('2024-02-01'),
    dateFin: new Date('2024-02-28'),
    actif: false
  }
];