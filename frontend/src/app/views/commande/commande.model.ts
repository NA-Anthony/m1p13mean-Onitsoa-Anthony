export const MODES_PAIEMENT = [
  'Carte bancaire',
  'Virement bancaire',
  'Espèces à la livraison',
  'Portefeuille numérique'
];

export interface Article {
  idProduitParBoutique: string;
  nomProduit: string;
  prixUnitaire: number;
  quantite: number;
  remise?: number;
}

export interface AdresseLivraison {
  rue: string;
  codePostal: string;
  ville: string;
  pays?: string;
}

export interface Commande {
  _id?: string;
  idAcheteur: string;
  idBoutique: string;
  dateCommande?: Date;
  statut?: 'en_attente' | 'confirmée' | 'préparée' | 'expédiée' | 'livrée' | 'annulée';
  articles: Article[];
  adresseLivraison: AdresseLivraison;
  fraisLivraison: number;
  total: number;
  modePaiement: string;
  paiementEffectue?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
