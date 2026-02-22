import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  TableModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    IconModule
  ]
})
export class PanierComponent {
  items = this.cartService.getPanier();
  itemsByBoutique = this.cartService.itemsByBoutique;
  totalItems = this.cartService.totalItems;
  sousTotal = this.cartService.sousTotal;
  fraisLivraison = this.cartService.fraisLivraison;
  total = this.cartService.total;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  modifierQuantite(id: string, quantite: number, stock: number): void {
    if (quantite < 1) return;
    if (quantite > stock) {
      alert(`Stock maximum: ${stock} unités`);
      return;
    }
    this.cartService.modifierQuantite(id, quantite);
    this.items = this.cartService.getPanier(); // Rafraîchir
  }

  retirerDuPanier(id: string): void {
    this.cartService.retirerDuPanier(id);
    this.items = this.cartService.getPanier();
  }

  getPrixItem(item: any): number {
    return item.enPromotion && item.prixPromo ? item.prixPromo : item.prix;
  }

  getTotalBoutique(items: any[]): number {
    return items.reduce((acc, item) => {
      const prix = this.getPrixItem(item);
      return acc + (prix * item.quantite);
    }, 0);
  }

  passerCommande(): void {
    this.router.navigate(['/checkout']);
  }

  continuerAchats(): void {
    this.router.navigate(['/catalogue']);
  }
}