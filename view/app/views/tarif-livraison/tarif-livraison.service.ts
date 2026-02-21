import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TarifLivraison, TARIFS_LIVRAISON_MOCK } from './tarif-livraison.model';
import { BOUTIQUES_MOCK } from '../boutique/boutique.model';

@Injectable({
  providedIn: 'root'
})
export class TarifLivraisonService {
  private tarifs: TarifLivraison[] = [...TARIFS_LIVRAISON_MOCK];

  getTarifs(): Observable<TarifLivraison[]> {
    const populated = this.tarifs.map(t => ({
      ...t,
      boutique: BOUTIQUES_MOCK.find(b => b._id === t.idBoutique)
    }));
    return of(populated);
  }

  getTarifById(id: string): Observable<TarifLivraison | undefined> {
    const t = this.tarifs.find(tarif => tarif._id === id);
    if (t) {
      const populated = {
        ...t,
        boutique: BOUTIQUES_MOCK.find(b => b._id === t.idBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  getTarifByBoutique(idBoutique: string): Observable<TarifLivraison | undefined> {
    const t = this.tarifs.find(tarif => tarif.idBoutique === idBoutique);
    if (t) {
      const populated = {
        ...t,
        boutique: BOUTIQUES_MOCK.find(b => b._id === t.idBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  createTarif(tarif: Partial<TarifLivraison>): Observable<TarifLivraison> {
    const newTarif: TarifLivraison = {
      _id: `TARIF${String(this.tarifs.length + 1).padStart(3, '0')}`,
      idBoutique: tarif.idBoutique || '',
      tarifs: tarif.tarifs || [],
      zoneGratuite: tarif.zoneGratuite || 0
    };
    this.tarifs.push(newTarif);
    
    const populated = {
      ...newTarif,
      boutique: BOUTIQUES_MOCK.find(b => b._id === newTarif.idBoutique)
    };
    return of(populated);
  }

  updateTarif(id: string, tarif: Partial<TarifLivraison>): Observable<TarifLivraison | undefined> {
    const index = this.tarifs.findIndex(t => t._id === id);
    if (index !== -1) {
      this.tarifs[index] = { ...this.tarifs[index], ...tarif };
      
      const populated = {
        ...this.tarifs[index],
        boutique: BOUTIQUES_MOCK.find(b => b._id === this.tarifs[index].idBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  deleteTarif(id: string): Observable<void> {
    this.tarifs = this.tarifs.filter(t => t._id !== id);
    return of(void 0);
  }

  calculerPrixLivraison(idBoutique: string, distance: number): number | null {
    const tarif = this.tarifs.find(t => t.idBoutique === idBoutique);
    if (!tarif) return null;
    
    // Vérifier si la distance est dans la zone gratuite
    if (distance >= tarif.zoneGratuite) return 0;
    
    // Chercher le tarif correspondant à la distance
    const tranche = tarif.tarifs.find(t => 
      distance >= t.distanceMin && distance < t.distanceMax
    );
    
    return tranche ? tranche.prix : null;
  }

  getDistanceMax(tarif: TarifLivraison): number {
    if (tarif.tarifs.length === 0) return 0;
    return Math.max(...tarif.tarifs.map(t => t.distanceMax));
  }

  getPrixMax(tarif: TarifLivraison): number {
    if (tarif.tarifs.length === 0) return 0;
    return Math.max(...tarif.tarifs.map(t => t.prix));
  }
}