import { Boutique } from '../boutique/boutique.model';

export interface Tarif {
  distanceMin: number;
  distanceMax: number;
  prix: number;
}

export interface TarifLivraison {
  _id: string;
  idBoutique: string;
  tarifs: Tarif[];
  zoneGratuite: number; // distance à partir de laquelle la livraison est gratuite (en km)
  createdAt?: Date;
  updatedAt?: Date;
  
  // Champs populés
  boutique?: Boutique;
}

export const TARIFS_LIVRAISON_MOCK: TarifLivraison[] = [
  {
    _id: 'TARIF001',
    idBoutique: '1',
    tarifs: [
      { distanceMin: 0, distanceMax: 5, prix: 3.99 },
      { distanceMin: 5, distanceMax: 10, prix: 5.99 },
      { distanceMin: 10, distanceMax: 20, prix: 8.99 },
      { distanceMin: 20, distanceMax: 50, prix: 12.99 }
    ],
    zoneGratuite: 50
  },
  {
    _id: 'TARIF002',
    idBoutique: '2',
    tarifs: [
      { distanceMin: 0, distanceMax: 3, prix: 2.99 },
      { distanceMin: 3, distanceMax: 8, prix: 4.99 },
      { distanceMin: 8, distanceMax: 15, prix: 7.99 }
    ],
    zoneGratuite: 30
  },
  {
    _id: 'TARIF003',
    idBoutique: '3',
    tarifs: [
      { distanceMin: 0, distanceMax: 2, prix: 2.50 },
      { distanceMin: 2, distanceMax: 5, prix: 4.50 },
      { distanceMin: 5, distanceMax: 10, prix: 6.50 },
      { distanceMin: 10, distanceMax: 25, prix: 9.50 }
    ],
    zoneGratuite: 40
  }
];