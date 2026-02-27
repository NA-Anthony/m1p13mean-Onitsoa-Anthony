import { Commande } from '../commande/commande.model';

export interface Livraison {
  _id: string;
  idCommande: string;
  statut: 'en_attente' | 'en_cours' | 'livree';
  livreur?: string;
  numeroSuivi?: string;
  dateEstimee?: Date;
  dateLivraison?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Champs populés
  commande?: Commande;
}

export const LIVRAISONS_MOCK: Livraison[] = [
  {
    _id: 'LIV001',
    idCommande: 'CMD001',
    statut: 'livree',
    livreur: 'Colissimo',
    numeroSuivi: 'COL123456789',
    dateEstimee: new Date('2024-03-17'),
    dateLivraison: new Date('2024-03-17')
  },
  {
    _id: 'LIV002',
    idCommande: 'CMD002',
    statut: 'en_cours',
    livreur: 'Chronopost',
    numeroSuivi: 'CHR987654321',
    dateEstimee: new Date('2024-03-22')
  },
  {
    _id: 'LIV003',
    idCommande: 'CMD003',
    statut: 'en_attente',
    livreur: 'DPD',
    numeroSuivi: 'DPD456789123',
    dateEstimee: new Date('2024-03-25')
  }
];

export const STATUTS_LIVRAISON = [
  { value: 'en_attente', label: 'En attente', color: 'warning' },
  { value: 'en_cours', label: 'En cours', color: 'info' },
  { value: 'livree', label: 'Livrée', color: 'success' }
];

export const LIVREURS = ['Colissimo', 'Chronopost', 'DPD', 'UPS', 'FedEx', 'La Poste', 'Mondial Relay'];