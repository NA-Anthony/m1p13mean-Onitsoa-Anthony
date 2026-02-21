import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Promotion, PROMOTIONS_MOCK } from './promotion.model';
import { PRODUITS_PAR_BOUTIQUE_POPULED } from '../produit-par-boutique/produit-par-boutique.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private promotions: Promotion[] = [...PROMOTIONS_MOCK];

  getPromotions(): Observable<Promotion[]> {
    // Peupler avec les produits par boutique
    const populated = this.promotions.map(promo => ({
      ...promo,
      produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === promo.idProduitParBoutique)
    }));
    return of(populated);
  }

  getPromotionById(id: string): Observable<Promotion | undefined> {
    const promo = this.promotions.find(p => p._id === id);
    if (promo) {
      const populated = {
        ...promo,
        produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === promo.idProduitParBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  getPromotionsByProduit(idProduitParBoutique: string): Observable<Promotion[]> {
    const promos = this.promotions.filter(p => p.idProduitParBoutique === idProduitParBoutique);
    const populated = promos.map(promo => ({
      ...promo,
      produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === promo.idProduitParBoutique)
    }));
    return of(populated);
  }

  getPromotionsActives(): Observable<Promotion[]> {
    const now = new Date();
    const actives = this.promotions.filter(p => 
      p.actif && 
      new Date(p.dateDebut) <= now && 
      new Date(p.dateFin) >= now
    );
    const populated = actives.map(promo => ({
      ...promo,
      produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === promo.idProduitParBoutique)
    }));
    return of(populated);
  }

  createPromotion(promotion: Partial<Promotion>): Observable<Promotion> {
    const newPromotion: Promotion = {
      _id: (this.promotions.length + 1).toString(),
      idProduitParBoutique: promotion.idProduitParBoutique || '',
      remisePourcentage: promotion.remisePourcentage || 0,
      dateDebut: promotion.dateDebut || new Date(),
      dateFin: promotion.dateFin || new Date(),
      actif: promotion.actif ?? true
    };
    this.promotions.push(newPromotion);
    
    const populated = {
      ...newPromotion,
      produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === newPromotion.idProduitParBoutique)
    };
    return of(populated);
  }

  updatePromotion(id: string, promotion: Partial<Promotion>): Observable<Promotion | undefined> {
    const index = this.promotions.findIndex(p => p._id === id);
    if (index !== -1) {
      this.promotions[index] = { ...this.promotions[index], ...promotion };
      
      const populated = {
        ...this.promotions[index],
        produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === this.promotions[index].idProduitParBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  deletePromotion(id: string): Observable<void> {
    this.promotions = this.promotions.filter(p => p._id !== id);
    return of(void 0);
  }

  toggleActif(id: string): Observable<Promotion | undefined> {
    const index = this.promotions.findIndex(p => p._id === id);
    if (index !== -1) {
      this.promotions[index].actif = !this.promotions[index].actif;
      
      const populated = {
        ...this.promotions[index],
        produitParBoutique: PRODUITS_PAR_BOUTIQUE_POPULED.find(p => p._id === this.promotions[index].idProduitParBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  isPromotionActive(promotion: Promotion): boolean {
    const now = new Date();
    return promotion.actif && 
           new Date(promotion.dateDebut) <= now && 
           new Date(promotion.dateFin) >= now;
  }

  getPrixAvecPromotion(produit: any, promotions: Promotion[]): number | null {
    const activePromo = promotions.find(p => 
      p.idProduitParBoutique === produit._id && 
      this.isPromotionActive(p)
    );
    
    if (activePromo && produit.prix) {
      const remise = (produit.prix * activePromo.remisePourcentage) / 100;
      return produit.prix - remise;
    }
    return null;
  }
}