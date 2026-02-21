import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Produit, PRODUITS_MOCK } from './produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private produits: Produit[] = [...PRODUITS_MOCK];

  getProduits(): Observable<Produit[]> {
    return of(this.produits);
  }

  getProduitById(id: string): Observable<Produit | undefined> {
    const produit = this.produits.find(p => p._id === id);
    return of(produit);
  }

  createProduit(produit: Partial<Produit>): Observable<Produit> {
    const newProduit: Produit = {
      _id: (this.produits.length + 1).toString(),
      nom: produit.nom || '',
      description: produit.description || '',
      categorie: produit.categorie || 'autre',
      image: produit.image || '',
      datePeremption: produit.datePeremption,
      caracteristiques: produit.caracteristiques || {}
    };
    this.produits.push(newProduit);
    return of(newProduit);
  }

  updateProduit(id: string, produit: Partial<Produit>): Observable<Produit | undefined> {
    const index = this.produits.findIndex(p => p._id === id);
    if (index !== -1) {
      this.produits[index] = { ...this.produits[index], ...produit };
      return of(this.produits[index]);
    }
    return of(undefined);
  }

  deleteProduit(id: string): Observable<void> {
    this.produits = this.produits.filter(p => p._id !== id);
    return of(void 0);
  }
}