import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  idProduitParBoutique: string;
  idBoutique: string;
  nomProduit: string;
  nomBoutique: string;
  prix: number;
  quantite: number;
  stock: number;
  image?: string;
  enPromotion?: boolean;
  prixPromo?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  // Computed signals
  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantite, 0));
  
  sousTotal = computed(() => this.cartItems().reduce((acc, item) => {
    const prix = item.enPromotion && item.prixPromo ? item.prixPromo : item.prix;
    return acc + (prix * item.quantite);
  }, 0));
  
  fraisLivraison = computed(() => {
    const total = this.sousTotal();
    if (total > 100) return 0;
    if (total > 50) return 2.99;
    return 4.99;
  });
  
  total = computed(() => this.sousTotal() + this.fraisLivraison());
  
  // Regrouper par boutique pour l'affichage
  itemsByBoutique = computed(() => {
    const groups = new Map<string, CartItem[]>();
    this.cartItems().forEach(item => {
      if (!groups.has(item.idBoutique)) {
        groups.set(item.idBoutique, []);
      }
      groups.get(item.idBoutique)!.push(item);
    });
    return groups;
  });

  ajouterAuPanier(item: CartItem): void {
    this.cartItems.update(items => {
      const existing = items.find(i => i.idProduitParBoutique === item.idProduitParBoutique);
      if (existing) {
        existing.quantite += item.quantite;
        return [...items];
      }
      return [...items, item];
    });
  }

  retirerDuPanier(idProduitParBoutique: string): void {
    this.cartItems.update(items => items.filter(i => i.idProduitParBoutique !== idProduitParBoutique));
  }

  modifierQuantite(idProduitParBoutique: string, quantite: number): void {
    this.cartItems.update(items => {
      const item = items.find(i => i.idProduitParBoutique === idProduitParBoutique);
      if (item) {
        if (quantite <= 0) {
          return items.filter(i => i.idProduitParBoutique !== idProduitParBoutique);
        }
        item.quantite = quantite;
      }
      return [...items];
    });
  }

  viderPanier(): void {
    this.cartItems.set([]);
  }

  getPanier(): CartItem[] {
    return this.cartItems();
  }
}