import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProduitParBoutique, PRODUITS_PAR_BOUTIQUE_POPULED } from './produit-par-boutique.model';
import { BOUTIQUES_MOCK } from '../boutique/boutique.model';
import { PRODUITS_MOCK } from '../produit/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitParBoutiqueService {
  private produitsParBoutique: ProduitParBoutique[] = [...PRODUITS_PAR_BOUTIQUE_POPULED];

  getProduitsParBoutique(): Observable<ProduitParBoutique[]> {
    return of(this.produitsParBoutique);
  }

  getProduitParBoutiqueById(id: string): Observable<ProduitParBoutique | undefined> {
    const item = this.produitsParBoutique.find(p => p._id === id);
    return of(item);
  }

  getProduitsByBoutique(idBoutique: string): Observable<ProduitParBoutique[]> {
    const items = this.produitsParBoutique.filter(p => p.idBoutique === idBoutique);
    return of(items);
  }

  getProduitsByProduit(idProduit: string): Observable<ProduitParBoutique[]> {
    const items = this.produitsParBoutique.filter(p => p.idProduit === idProduit);
    return of(items);
  }

  createProduitParBoutique(item: Partial<ProduitParBoutique>): Observable<ProduitParBoutique> {
    const newItem: ProduitParBoutique = {
      _id: (this.produitsParBoutique.length + 1).toString(),
      idBoutique: item.idBoutique || '',
      idProduit: item.idProduit || '',
      prix: item.prix || 0,
      stock: item.stock || 0,
      enPromotion: item.enPromotion || false,
      prixPromo: item.prixPromo,
      boutique: BOUTIQUES_MOCK.find(b => b._id === item.idBoutique),
      produit: PRODUITS_MOCK.find(p => p._id === item.idProduit)
    };
    this.produitsParBoutique.push(newItem);
    return of(newItem);
  }

  updateProduitParBoutique(id: string, item: Partial<ProduitParBoutique>): Observable<ProduitParBoutique | undefined> {
    const index = this.produitsParBoutique.findIndex(p => p._id === id);
    if (index !== -1) {
      this.produitsParBoutique[index] = { 
        ...this.produitsParBoutique[index], 
        ...item,
        boutique: BOUTIQUES_MOCK.find(b => b._id === (item.idBoutique || this.produitsParBoutique[index].idBoutique)),
        produit: PRODUITS_MOCK.find(p => p._id === (item.idProduit || this.produitsParBoutique[index].idProduit))
      };
      return of(this.produitsParBoutique[index]);
    }
    return of(undefined);
  }

  deleteProduitParBoutique(id: string): Observable<void> {
    this.produitsParBoutique = this.produitsParBoutique.filter(p => p._id !== id);
    return of(void 0);
  }

  updateStock(id: string, nouvelleQuantite: number): Observable<ProduitParBoutique | undefined> {
    const index = this.produitsParBoutique.findIndex(p => p._id === id);
    if (index !== -1) {
      this.produitsParBoutique[index].stock = nouvelleQuantite;
      return of(this.produitsParBoutique[index]);
    }
    return of(undefined);
  }

  togglePromotion(id: string): Observable<ProduitParBoutique | undefined> {
    const index = this.produitsParBoutique.findIndex(p => p._id === id);
    if (index !== -1) {
      this.produitsParBoutique[index].enPromotion = !this.produitsParBoutique[index].enPromotion;
      return of(this.produitsParBoutique[index]);
    }
    return of(undefined);
  }
}