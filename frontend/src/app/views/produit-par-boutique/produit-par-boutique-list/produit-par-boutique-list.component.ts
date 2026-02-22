import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { BOUTIQUES_MOCK } from '../../boutique/boutique.model';
import { PRODUITS_MOCK } from '../../produit/produit.model';

@Component({
  selector: 'app-produit-par-boutique-list',
  templateUrl: './produit-par-boutique-list.component.html',
  styleUrls: ['./produit-par-boutique-list.component.scss'],
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
export class ProduitParBoutiqueListComponent implements OnInit {
  items: ProduitParBoutique[] = [];
  filteredItems: ProduitParBoutique[] = [];
  searchTerm: string = '';
  filterBoutique: string = '';
  filterStock: string = 'tous';
  
  boutiques = BOUTIQUES_MOCK;

  constructor(
    private service: ProduitParBoutiqueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.service.getProduitsParBoutique().subscribe({
      next: (data) => {
        this.items = data;
        this.filteredItems = data;
      }
    });
  }

  filterItems(): void {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = this.searchTerm === '' || 
        item.produit?.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.boutique?.nomBoutique.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesBoutique = this.filterBoutique === '' || 
        item.idBoutique === this.filterBoutique;
      
      const matchesStock = this.filterStock === 'tous' || 
        (this.filterStock === 'en_stock' && item.stock > 0) ||
        (this.filterStock === 'rupture' && item.stock === 0) ||
        (this.filterStock === 'alerte' && item.stock > 0 && item.stock < 5);
      
      return matchesSearch && matchesBoutique && matchesStock;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/produits-par-boutique', id]);
  }

  deleteItem(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit de la boutique ?')) {
      this.service.deleteProduitParBoutique(id).subscribe({
        next: () => this.loadItems()
      });
    }
  }

  togglePromotion(id: string, event: Event): void {
    event.stopPropagation();
    this.service.togglePromotion(id).subscribe({
      next: () => this.loadItems()
    });
  }

  getTotalItems(): number {
    return this.items.length;
  }

  getTotalValeurStock(): number {
    return this.items.reduce((acc, item) => acc + (item.prix * item.stock), 0);
  }

  getTotalEnPromotion(): number {
    return this.items.filter(i => i.enPromotion).length;
  }

  getTotalRupture(): number {
    return this.items.filter(i => i.stock === 0).length;
  }

  getStockStatus(stock: number): { class: string, label: string } {
    if (stock === 0) return { class: 'danger', label: 'Rupture' };
    if (stock < 5) return { class: 'warning', label: 'Stock faible' };
    return { class: 'success', label: 'En stock' };
  }

  getPrixActuel(item: ProduitParBoutique): number {
    return item.enPromotion && item.prixPromo ? item.prixPromo : item.prix;
  }

  getRemise(item: ProduitParBoutique): number {
    if (!item.enPromotion || !item.prixPromo) return 0;
    return Math.round(((item.prix - item.prixPromo) / item.prix) * 100);
  }
}