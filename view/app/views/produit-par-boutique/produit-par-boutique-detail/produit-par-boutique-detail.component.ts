import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ProduitParBoutiqueService } from '../produit-par-boutique.service';
import { ProduitParBoutique } from '../produit-par-boutique.model';

@Component({
  selector: 'app-produit-par-boutique-detail',
  templateUrl: './produit-par-boutique-detail.component.html',
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
    ProgressModule,
    IconModule
  ]
})
export class ProduitParBoutiqueDetailComponent implements OnInit {
  item: ProduitParBoutique | null = null;
  quantiteInput: number = 0;

  constructor(
    private route: ActivatedRoute,
    private service: ProduitParBoutiqueService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getProduitParBoutiqueById(id).subscribe({
        next: (data) => {
          this.item = data || null;
          if (this.item) {
            this.quantiteInput = this.item.stock;
          }
        }
      });
    }
  }

  getStockStatus(): { class: string, label: string } {
    if (!this.item) return { class: 'secondary', label: 'Inconnu' };
    if (this.item.stock === 0) return { class: 'danger', label: 'Rupture' };
    if (this.item.stock < 5) return { class: 'warning', label: 'Stock faible' };
    return { class: 'success', label: 'En stock' };
  }

  getPrixActuel(): number {
    if (!this.item) return 0;
    return this.item.enPromotion && this.item.prixPromo ? this.item.prixPromo : this.item.prix;
  }

  getRemise(): number {
    if (!this.item || !this.item.enPromotion || !this.item.prixPromo) return 0;
    return Math.round(((this.item.prix - this.item.prixPromo) / this.item.prix) * 100);
  }

  getValeurStock(): number {
    if (!this.item) return 0;
    return this.item.stock * this.getPrixActuel();
  }

  updateStock(): void {
    if (!this.item) return;
    
    if (this.quantiteInput < 0) {
      alert('La quantité ne peut pas être négative');
      return;
    }

    this.service.updateStock(this.item._id, this.quantiteInput).subscribe({
      next: (updated) => {
        if (updated) {
          this.item = updated;
          alert('Stock mis à jour avec succès');
        }
      }
    });
  }

  togglePromotion(): void {
    if (!this.item) return;
    
    this.service.togglePromotion(this.item._id).subscribe({
      next: (updated) => {
        if (updated) {
          this.item = updated;
        }
      }
    });
  }

  formatDate(date?: Date): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}