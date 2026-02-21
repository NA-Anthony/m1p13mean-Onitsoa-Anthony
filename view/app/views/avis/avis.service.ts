import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Avis, AVIS_MOCK } from './avis.model';
import { ACHETEURS_MOCK } from '../acheteur/acheteur.model';
import { PRODUITS_PAR_BOUTIQUE_POPULED } from '../produit-par-boutique/produit-par-boutique.model';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private avis: Avis[] = [...AVIS_MOCK];

  getAvis(): Observable<Avis[]> {
    const populated = this.avis.map(a => ({
      ...a,
      acheteur: ACHETEURS_MOCK.find(ach => ach._id === a.idAcheteur),
      produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === a.idProduitParBoutique)
    }));
    return of(populated);
  }

  getAvisById(id: string): Observable<Avis | undefined> {
    const a = this.avis.find(av => av._id === id);
    if (a) {
      const populated = {
        ...a,
        acheteur: ACHETEURS_MOCK.find(ach => ach._id === a.idAcheteur),
        produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === a.idProduitParBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  getAvisByProduit(idProduitParBoutique: string): Observable<Avis[]> {
    const filtered = this.avis.filter(a => a.idProduitParBoutique === idProduitParBoutique);
    const populated = filtered.map(a => ({
      ...a,
      acheteur: ACHETEURS_MOCK.find(ach => ach._id === a.idAcheteur),
      produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === a.idProduitParBoutique)
    }));
    return of(populated);
  }

  getAvisByAcheteur(idAcheteur: string): Observable<Avis[]> {
    const filtered = this.avis.filter(a => a.idAcheteur === idAcheteur);
    const populated = filtered.map(a => ({
      ...a,
      acheteur: ACHETEURS_MOCK.find(ach => ach._id === a.idAcheteur),
      produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === a.idProduitParBoutique)
    }));
    return of(populated);
  }

  createAvis(avis: Partial<Avis>): Observable<Avis> {
    const newAvis: Avis = {
      _id: `AVIS${String(this.avis.length + 1).padStart(3, '0')}`,
      idAcheteur: avis.idAcheteur || '',
      idProduitParBoutique: avis.idProduitParBoutique || '',
      note: avis.note || 5,
      commentaire: avis.commentaire || '',
      createdAt: new Date()
    };
    this.avis.push(newAvis);
    
    const populated = {
      ...newAvis,
      acheteur: ACHETEURS_MOCK.find(ach => ach._id === newAvis.idAcheteur),
      produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === newAvis.idProduitParBoutique)
    };
    return of(populated);
  }

  updateAvis(id: string, avis: Partial<Avis>): Observable<Avis | undefined> {
    const index = this.avis.findIndex(a => a._id === id);
    if (index !== -1) {
      this.avis[index] = { ...this.avis[index], ...avis };
      
      const populated = {
        ...this.avis[index],
        acheteur: ACHETEURS_MOCK.find(ach => ach._id === this.avis[index].idAcheteur),
        produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === this.avis[index].idProduitParBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  repondreAvis(id: string, reponse: string): Observable<Avis | undefined> {
    const index = this.avis.findIndex(a => a._id === id);
    if (index !== -1) {
      this.avis[index].reponseBoutique = {
        commentaire: reponse,
        date: new Date()
      };
      
      const populated = {
        ...this.avis[index],
        acheteur: ACHETEURS_MOCK.find(ach => ach._id === this.avis[index].idAcheteur),
        produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === this.avis[index].idProduitParBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  deleteAvis(id: string): Observable<void> {
    this.avis = this.avis.filter(a => a._id !== id);
    return of(void 0);
  }

  getNoteMoyenne(idProduitParBoutique: string): number {
    const avisProduit = this.avis.filter(a => a.idProduitParBoutique === idProduitParBoutique);
    if (avisProduit.length === 0) return 0;
    const sum = avisProduit.reduce((acc, a) => acc + a.note, 0);
    return sum / avisProduit.length;
  }

  getNoteColor(note: number): string {
    if (note >= 4) return 'success';
    if (note >= 3) return 'warning';
    return 'danger';
  }
}