import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule
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
    IconModule
  ]
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  searchTerm: string = '';
  filterCategorie: string = '';
  categories = CATEGORIES_PRODUIT;

  constructor(
    private produitService: ProduitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.filteredProduits = data;
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

  deleteProduit(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: () => this.loadProduits()
      });
    }
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
}