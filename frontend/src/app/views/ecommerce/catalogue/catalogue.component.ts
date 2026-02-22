import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  ModalModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CartService } from '../cart.service';
import { ProduitParBoutiqueService } from '../../produit-par-boutique/produit-par-boutique.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
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
    ModalModule,
    IconModule
  ]
})
export class CatalogueComponent implements OnInit {
  produits: any[] = [];
  filteredProduits: any[] = [];
  searchTerm: string = '';
  selectedCategorie: string = '';
  categories: string[] = [];
  
  // Modal
  showModal = false;
  selectedProduit: any = null;
  quantite = 1;

  constructor(
    private produitService: ProduitParBoutiqueService,
    public cartService: CartService  // ← CHANGÉ DE private À public
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getProduitsParBoutique().subscribe({
      next: (data) => {
        this.produits = data;
        this.filteredProduits = data;
        
        // Extraire les catégories uniques et filtrer les undefined
        const cats = new Set(data.map(p => p.produit?.categorie).filter(Boolean));
        this.categories = Array.from(cats) as string[];  // ← CORRIGÉ
      }
    });
  }

  filterProduits(): void {
    this.filteredProduits = this.produits.filter(p => {
      const matchesSearch = this.searchTerm === '' || 
        p.produit?.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.boutique?.nomBoutique.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategorie = this.selectedCategorie === '' || 
        p.produit?.categorie === this.selectedCategorie;
      
      return matchesSearch && matchesCategorie;
    });
  }

  openQuickView(produit: any): void {
    this.selectedProduit = produit;
    this.quantite = 1;
    this.showModal = true;
  }

  ajouterAuPanier(): void {
    if (!this.selectedProduit) return;
    
    const prix = this.selectedProduit.enPromotion && this.selectedProduit.prixPromo 
      ? this.selectedProduit.prixPromo 
      : this.selectedProduit.prix;
    
    this.cartService.ajouterAuPanier({
      idProduitParBoutique: this.selectedProduit._id,
      idBoutique: this.selectedProduit.idBoutique,
      nomProduit: this.selectedProduit.produit.nom,
      nomBoutique: this.selectedProduit.boutique.nomBoutique,
      prix: prix,
      quantite: this.quantite,
      stock: this.selectedProduit.stock,
      image: this.selectedProduit.produit.image,
      enPromotion: this.selectedProduit.enPromotion,
      prixPromo: this.selectedProduit.prixPromo
    });
    
    this.showModal = false;
    alert('Produit ajouté au panier !');
  }

  getPrixActuel(produit: any): number {
    return produit.enPromotion && produit.prixPromo ? produit.prixPromo : produit.prix;
  }

  getRemise(produit: any): number {
    if (!produit.enPromotion || !produit.prixPromo) return 0;
    return Math.round(((produit.prix - produit.prixPromo) / produit.prix) * 100);
  }
}