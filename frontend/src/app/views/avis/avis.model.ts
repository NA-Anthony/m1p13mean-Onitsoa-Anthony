import { Acheteur } from '../acheteur/acheteur.model';
import { ProduitParBoutique } from '../produit-par-boutique/produit-par-boutique.model';

export interface ReponseBoutique {
  commentaire: string;
  date: Date;
}

export interface Avis {
  _id: string;
  idAcheteur: string;
  idProduitParBoutique: string;
  note: number;
  commentaire?: string;
  reponseBoutique?: ReponseBoutique;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Champs populés
  acheteur?: Acheteur;
  produitParBoutique?: ProduitParBoutique;
}

export const AVIS_MOCK: Avis[] = [
  {
    _id: 'AVIS001',
    idAcheteur: '1',
    idProduitParBoutique: '1',
    note: 5,
    commentaire: 'Excellent produit, livraison rapide ! Le smartphone est parfait, rien à redire.',
    createdAt: new Date('2024-03-16T10:30:00')
  },
  {
    _id: 'AVIS002',
    idAcheteur: '2',
    idProduitParBoutique: '1',
    note: 4,
    commentaire: 'Bon produit mais un peu cher. La batterie tient bien la journée.',
    reponseBoutique: {
      commentaire: 'Merci pour votre retour ! Nous travaillons sur nos prix pour être plus compétitifs.',
      date: new Date('2024-03-17T14:20:00')
    },
    createdAt: new Date('2024-03-15T09:15:00')
  },
  {
    _id: 'AVIS003',
    idAcheteur: '3',
    idProduitParBoutique: '2',
    note: 3,
    commentaire: 'Le jean est correct mais la taille ne correspond pas tout à fait.',
    createdAt: new Date('2024-03-18T16:45:00')
  },
  {
    _id: 'AVIS004',
    idAcheteur: '1',
    idProduitParBoutique: '3',
    note: 5,
    commentaire: 'Pâtes délicieuses, cuisson parfaite. Je recommande !',
    createdAt: new Date('2024-03-19T11:20:00')
  }
];

export const NOTES = [1, 2, 3, 4, 5];