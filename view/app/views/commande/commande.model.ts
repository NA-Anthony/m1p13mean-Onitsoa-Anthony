import { Acheteur } from '../acheteur/acheteur.model';
import { Boutique } from '../boutique/boutique.model';

export interface ArticleCommande {
  idProduitParBoutique: string;
  nomProduit: string;
  prixUnitaire: number;
  quantite: number;
  remise: number;
}

export interface AdresseLivraison {
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export interface Commande {
  _id: string;
  idAcheteur: string;
  idBoutique: string;
  dateCommande: Date;
  statut: 'en_attente' | 'confirmée' | 'préparée' | 'expédiée' | 'livrée' | 'annulée';
  articles: ArticleCommande[];
  adresseLivraison: AdresseLivraison;
  fraisLivraison: number;
  total: number;
  modePaiement: string;
  paiementEffectue: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Champs populés
  acheteur?: Acheteur;
  boutique?: Boutique;
}

export const COMMANDES_MOCK: Commande[] = [
  {
    _id: 'CMD001',
    idAcheteur: '1',
    idBoutique: '1',
    dateCommande: new Date('2024-03-15T10:30:00'),
    statut: 'livrée',
    articles: [
      {
        idProduitParBoutique: '1',
        nomProduit: 'Smartphone Galaxy S23',
        prixUnitaire: 899.99,
        quantite: 1,
        remise: 100
      },
      {
        idProduitParBoutique: '2',
        nomProduit: 'Jean slim noir',
        prixUnitaire: 49.99,
        quantite: 2,
        remise: 0
      }
    ],
    adresseLivraison: {
      rue: '15 Rue de la Paix',
      ville: 'Paris',
      codePostal: '75002',
      pays: 'France'
    },
    fraisLivraison: 5.99,
    total: 905.96,
    modePaiement: 'Carte bancaire',
    paiementEffectue: true
  },
  {
    _id: 'CMD002',
    idAcheteur: '2',
    idBoutique: '2',
    dateCommande: new Date('2024-03-18T14:45:00'),
    statut: 'en_attente',
    articles: [
      {
        idProduitParBoutique: '3',
        nomProduit: 'Pâtes bio',
        prixUnitaire: 3.99,
        quantite: 5,
        remise: 0
      }
    ],
    adresseLivraison: {
      rue: '8 Avenue des Champs-Élysées',
      ville: 'Paris',
      codePostal: '75008',
      pays: 'France'
    },
    fraisLivraison: 3.99,
    total: 23.94,
    modePaiement: 'Paypal',
    paiementEffectue: true
  },
  {
    _id: 'CMD003',
    idAcheteur: '3',
    idBoutique: '1',
    dateCommande: new Date('2024-03-20T09:15:00'),
    statut: 'confirmée',
    articles: [
      {
        idProduitParBoutique: '4',
        nomProduit: 'Canapé 3 places',
        prixUnitaire: 399.99,
        quantite: 1,
        remise: 0
      }
    ],
    adresseLivraison: {
      rue: '78 Rue Paradis',
      ville: 'Marseille',
      codePostal: '13006',
      pays: 'France'
    },
    fraisLivraison: 19.99,
    total: 419.98,
    modePaiement: 'Virement',
    paiementEffectue: false
  }
];

export const STATUTS_COMMANDE = [
  { value: 'en_attente', label: 'En attente', color: 'warning' },
  { value: 'confirmée', label: 'Confirmée', color: 'info' },
  { value: 'préparée', label: 'Préparée', color: 'primary' },
  { value: 'expédiée', label: 'Expédiée', color: 'primary' },
  { value: 'livrée', label: 'Livrée', color: 'success' },
  { value: 'annulée', label: 'Annulée', color: 'danger' }
];

export const MODES_PAIEMENT = ['Carte bancaire', 'Paypal', 'Virement', 'Apple Pay', 'Espèces'];