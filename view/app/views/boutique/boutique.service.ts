import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Boutique, BOUTIQUES_MOCK } from './boutique.model';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  private boutiques: Boutique[] = [...BOUTIQUES_MOCK];

  getBoutiques(): Observable<Boutique[]> {
    return of(this.boutiques);
  }

  getBoutiqueById(id: string): Observable<Boutique | undefined> {
    const boutique = this.boutiques.find(b => b._id === id);
    return of(boutique);
  }

  createBoutique(boutique: Partial<Boutique>): Observable<Boutique> {
    const newBoutique: Boutique = {
      _id: (this.boutiques.length + 1).toString(),
      nomBoutique: boutique.nomBoutique || '',
      description: boutique.description || '',
      adresse: boutique.adresse || '',
      telephone: boutique.telephone || '',
      logo: boutique.logo || 'assets/images/avatars/1.jpg',
      modePaiementAcceptes: boutique.modePaiementAcceptes || [],
      horaires: boutique.horaires || {
        lundi: { ouverture: '', fermeture: '' },
        mardi: { ouverture: '', fermeture: '' },
        mercredi: { ouverture: '', fermeture: '' },
        jeudi: { ouverture: '', fermeture: '' },
        vendredi: { ouverture: '', fermeture: '' },
        samedi: { ouverture: '', fermeture: '' },
        dimanche: { ouverture: '', fermeture: '' }
      },
      noteMoyenne: 0,
      totalAvis: 0
    };
    this.boutiques.push(newBoutique);
    return of(newBoutique);
  }

  updateBoutique(id: string, boutique: Partial<Boutique>): Observable<Boutique | undefined> {
    const index = this.boutiques.findIndex(b => b._id === id);
    if (index !== -1) {
      this.boutiques[index] = { ...this.boutiques[index], ...boutique };
      return of(this.boutiques[index]);
    }
    return of(undefined);
  }

  deleteBoutique(id: string): Observable<void> {
    this.boutiques = this.boutiques.filter(b => b._id !== id);
    return of(void 0);
  }
}