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
  ToastModule,
  SpinnerModule,
  AlertModule,
  ModalModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ProduitService } from '../produit.service';
import { Produit, CATEGORIES_PRODUIT } from '../produit.model';

@Component({
  selector: 'app-produit-list',
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.scss'],
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
    ToastModule,
    SpinnerModule,
    AlertModule,
    ModalModule,
    IconModule
  ]
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  searchTerm: string = '';
  filterCategorie: string = '';
  categories = CATEGORIES_PRODUIT;
  
  loading = true;
  error: string | null = null;
  
  // Pour le modal de suppression
  showDeleteModal = false;
  produitToDelete: Produit | null = null;
  
  // Pour les toasts
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';

  constructor(
    private produitService: ProduitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.loading = true;
    this.error = null;
    
    this.produitService.getAllProduitsAdmin().subscribe({
      next: (data) => {
        this.produits = data;
        this.filteredProduits = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.msg || 'Erreur lors du chargement des produits';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterProduits(): void {
    this.filteredProduits = this.produits.filter(produit => {
      const matchesSearch = this.searchTerm === '' || 
        produit.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        produit.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategorie = this.filterCategorie === '' || 
        produit.categorie === this.filterCategorie;
      
      return matchesSearch && matchesCategorie;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/produits', id]);
  }

  confirmDelete(produit: Produit, event: Event): void {
    event.stopPropagation();
    this.produitToDelete = produit;
    this.showDeleteModal = true;
  }

  deleteProduit(): void {
    if (!this.produitToDelete) return;
    
    this.produitService.deleteProduit(this.produitToDelete._id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.produitToDelete = null;
        this.showToastMessage('Produit supprimé avec succès', 'success');
        this.loadProduits();
      },
      error: (err) => {
        this.showDeleteModal = false;
        this.showToastMessage(err.error?.msg || 'Erreur lors de la suppression', 'danger');
        console.error(err);
      }
    });
  }

  getTotalProduits(): number {
    return this.produits.length;
  }

  getTotalByCategorie(categorie: string): number {
    return this.produits.filter(p => p.categorie === categorie).length;
  }

  getCategorieLabel(categorie: string): string {
    const cat = this.categories.find(c => c.value === categorie);
    return cat ? cat.label : categorie;
  }

  getCategorieIcon(categorie: string): string {
    const cat = this.categories.find(c => c.value === categorie);
    return cat ? cat.icon : 'cil-star';
  }

  getCategorieColor(categorie: string): string {
    switch(categorie) {
      case 'alimentaire': return 'success';
      case 'habillement': return 'info';
      case 'electronique': return 'warning';
      case 'maison': return 'primary';
      default: return 'secondary';
    }
  }

  formatDate(date?: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  isPerime(date?: Date): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  private showToastMessage(message: string, color: 'success' | 'danger'): void {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}