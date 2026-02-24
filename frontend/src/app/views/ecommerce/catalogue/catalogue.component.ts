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
    this.produitService.getAllProduitsParBoutique().subscribe({
      next: (data: any) => {
        this.produits = data;
        this.filteredProduits = data;
        
        // Extraire les catégories uniques et filtrer les undefined
        const cats = new Set(data.map((p: any) => p.produit?.categorie).filter(Boolean));
        this.categories = Array.from(cats) as string[];
      }
    });
  }

  filterProduits(): void {
    this.filteredProduits = this.produits.filter(p => {
      const nomProduit = p.produit?.nom || p.idProduit?.nom || '';
      const nomBoutique = p.boutique?.nomBoutique || p.idBoutique?.nomBoutique || '';
      const matchesSearch = this.searchTerm === '' || 
        nomProduit.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        nomBoutique.toLowerCase().includes(this.searchTerm.toLowerCase());
      
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
    
    const prix = (this.selectedProduit.enPromotion && this.selectedProduit.prixPromo)
      ? this.selectedProduit.prixPromo
      : this.selectedProduit.prix;
    const idBoutiqueValue = (typeof this.selectedProduit.idBoutique === 'string')
      ? this.selectedProduit.idBoutique
      : (this.selectedProduit.idBoutique && this.selectedProduit.idBoutique._id) || this.selectedProduit.boutique?._id;

    const nomBoutiqueValue = this.selectedProduit.boutique?.nomBoutique || (this.selectedProduit.idBoutique && this.selectedProduit.idBoutique.nomBoutique) || 'Boutique';

    this.cartService.ajouterAuPanier({
      idProduitParBoutique: this.selectedProduit._id,
      idBoutique: idBoutiqueValue,
      nomProduit: this.selectedProduit.produit?.nom || this.selectedProduit.idProduit?.nom || 'Produit',
      nomBoutique: nomBoutiqueValue,
      prix: prix,
      quantite: this.quantite,
      stock: this.selectedProduit.stock,
      image: this.selectedProduit.produit?.image || this.selectedProduit.idProduit?.image,
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