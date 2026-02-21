import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Acheteur, ACHETEURS_MOCK } from './acheteur.model';

@Injectable({
  providedIn: 'root'
})
export class AcheteurService {
  private acheteurs: Acheteur[] = [...ACHETEURS_MOCK];

  getAcheteurs(): Observable<Acheteur[]> {
    return of(this.acheteurs);
  }

  getAcheteurById(id: string): Observable<Acheteur | undefined> {
    const acheteur = this.acheteurs.find(a => a._id === id);
    return of(acheteur);
  }

  createAcheteur(acheteur: Partial<Acheteur>): Observable<Acheteur> {
    const newAcheteur: Acheteur = {
      _id: (this.acheteurs.length + 1).toString(),
      telephone: acheteur.telephone || '',
      adresseLivraisonParDefaut: acheteur.adresseLivraisonParDefaut || {
        rue: '',
        ville: '',
        codePostal: '',
        pays: 'France'
      },
      preferences: acheteur.preferences || []
    };
    this.acheteurs.push(newAcheteur);
    return of(newAcheteur);
  }

  updateAcheteur(id: string, acheteur: Partial<Acheteur>): Observable<Acheteur | undefined> {
    const index = this.acheteurs.findIndex(a => a._id === id);
    if (index !== -1) {
      this.acheteurs[index] = { ...this.acheteurs[index], ...acheteur };
      return of(this.acheteurs[index]);
    }
    return of(undefined);
  }

  deleteAcheteur(id: string): Observable<void> {
    this.acheteurs = this.acheteurs.filter(a => a._id !== id);
    return of(void 0);
  }
}