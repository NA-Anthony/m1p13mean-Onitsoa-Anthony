import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Livraison, LIVRAISONS_MOCK, STATUTS_LIVRAISON } from './livraison.model'; // ← Ajouter STATUTS_LIVRAISON
import { COMMANDES_MOCK } from '../commande/commande.model';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private livraisons: Livraison[] = [...LIVRAISONS_MOCK];

  getLivraisons(): Observable<Livraison[]> {
    const populated = this.livraisons.map(l => ({
      ...l,
      commande: COMMANDES_MOCK.find(c => c._id === l.idCommande)
    }));
    return of(populated);
  }

  getLivraisonById(id: string): Observable<Livraison | undefined> {
    const l = this.livraisons.find(liv => liv._id === id);
    if (l) {
      const populated = {
        ...l,
        commande: COMMANDES_MOCK.find(c => c._id === l.idCommande)
      };
      return of(populated);
    }
    return of(undefined);
  }

  getLivraisonsByCommande(idCommande: string): Observable<Livraison[]> {
    const filtered = this.livraisons.filter(l => l.idCommande === idCommande);
    const populated = filtered.map(l => ({
      ...l,
      commande: COMMANDES_MOCK.find(c => c._id === l.idCommande)
    }));
    return of(populated);
  }

  createLivraison(livraison: Partial<Livraison>): Observable<Livraison> {
    const newLivraison: Livraison = {
      _id: `LIV${String(this.livraisons.length + 1).padStart(3, '0')}`,
      idCommande: livraison.idCommande || '',
      statut: 'en_attente',
      livreur: livraison.livreur || '',
      numeroSuivi: livraison.numeroSuivi || '',
      dateEstimee: livraison.dateEstimee || new Date(),
      dateLivraison: livraison.dateLivraison
    };
    this.livraisons.push(newLivraison);
    
    const populated = {
      ...newLivraison,
      commande: COMMANDES_MOCK.find(c => c._id === newLivraison.idCommande)
    };
    return of(populated);
  }

  updateLivraison(id: string, livraison: Partial<Livraison>): Observable<Livraison | undefined> {
    const index = this.livraisons.findIndex(l => l._id === id);
    if (index !== -1) {
      this.livraisons[index] = { ...this.livraisons[index], ...livraison };
      
      const populated = {
        ...this.livraisons[index],
        commande: COMMANDES_MOCK.find(c => c._id === this.livraisons[index].idCommande)
      };
      return of(populated);
    }
    return of(undefined);
  }

  updateStatut(id: string, statut: string): Observable<Livraison | undefined> {
    const index = this.livraisons.findIndex(l => l._id === id);
    if (index !== -1) {
      this.livraisons[index].statut = statut as any;
      
      // Si livrée, ajouter la date de livraison
      if (statut === 'livree' && !this.livraisons[index].dateLivraison) {
        this.livraisons[index].dateLivraison = new Date();
      }
      
      const populated = {
        ...this.livraisons[index],
        commande: COMMANDES_MOCK.find(c => c._id === this.livraisons[index].idCommande)
      };
      return of(populated);
    }
    return of(undefined);
  }

  deleteLivraison(id: string): Observable<void> {
    this.livraisons = this.livraisons.filter(l => l._id !== id);
    return of(void 0);
  }

  getStatutInfo(statut: string): { label: string, color: string } {
    const found = STATUTS_LIVRAISON.find((s: any) => s.value === statut);
    return found || { label: statut, color: 'secondary' };
  }

  getRetardEstime(dateEstimee?: Date): number {
    if (!dateEstimee) return 0;
    const now = new Date();
    const estimee = new Date(dateEstimee);
    const diff = now.getTime() - estimee.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}