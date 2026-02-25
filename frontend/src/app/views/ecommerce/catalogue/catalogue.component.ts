import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  ModalModule,
  SpinnerModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CartService } from '../cart.service';
import { ProduitParBoutiqueService } from '../../produit-par-boutique/produit-par-boutique.service';
import { BoutiqueService } from '../../boutique/boutique.service';

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
    SpinnerModule,
    IconModule
  ]
})
export class CatalogueComponent implements OnInit {
  produits: any[] = [];
  filteredProduits: any[] = [];
  searchTerm: string = '';
  selectedCategorie: string = '';
  categories: string[] = [];

  // Boutique sélectionnée (depuis la route)
  boutiqueId: string = '';
  boutique: any = null;
  loading = true;
  error = '';

  // Modal
  showModal = false;
  selectedProduit: any = null;
  quantite = 1;

  constructor(
    private produitService: ProduitParBoutiqueService,
    private boutiqueService: BoutiqueService,
    private route: ActivatedRoute,
    private router: Router,
    public cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.boutiqueId = params['boutiqueId'] || '';
      if (this.boutiqueId) {
        this.loadBoutiqueEtProduits();
      } else {
        // Pas d'id boutique → redirecte vers la liste des boutiques
        this.router.navigate(['/ecommerce/boutiques']);
      }
    });
  }

  loadBoutiqueEtProduits(): void {
    this.loading = true;
    this.error = '';

    // Charger infos boutique
    this.boutiqueService.getBoutiqueById(this.boutiqueId).subscribe({
      next: (data: any) => {
        // L'API retourne { boutique, produits, totalProduits }
        this.boutique = data.boutique || data;
        const produitsData: any[] = data.produits || [];

        this.produits = produitsData.map((item: any) => ({
          ...item,
          produit: item.idProduit || item.produit,
          boutique: item.idBoutique || item.boutique
        }));
        this.filteredProduits = [...this.produits];

        // Extraire catégories uniques
        const cats = new Set(
          this.produits.map((p: any) => p.idProduit?.categorie || p.produit?.categorie).filter(Boolean)
        );
        this.categories = Array.from(cats) as string[];

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement boutique', err);
        this.error = 'Impossible de charger les produits de cette boutique.';
        this.loading = false;
      }
    });
  }

  filterProduits(): void {
    this.filteredProduits = this.produits.filter(p => {
      const nomProduit = p.idProduit?.nom || p.produit?.nom || '';
      const categorie = p.idProduit?.categorie || p.produit?.categorie || '';

      const matchesSearch = this.searchTerm === '' ||
        nomProduit.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategorie = this.selectedCategorie === '' ||
        categorie === this.selectedCategorie;

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
      : (this.selectedProduit.idBoutique?._id) || this.selectedProduit.boutique?._id;

    const nomBoutiqueValue = this.boutique?.nomBoutique
      || this.selectedProduit.boutique?.nomBoutique
      || this.selectedProduit.idBoutique?.nomBoutique
      || 'Boutique';

    this.cartService.ajouterAuPanier({
      idProduitParBoutique: this.selectedProduit._id,
      idBoutique: idBoutiqueValue,
      nomProduit: this.selectedProduit.idProduit?.nom || this.selectedProduit.produit?.nom || 'Produit',
      nomBoutique: nomBoutiqueValue,
      prix: prix,
      quantite: this.quantite,
      stock: this.selectedProduit.stock,
      image: this.selectedProduit.idProduit?.image || this.selectedProduit.produit?.image,
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

  retourBoutiques(): void {
    this.router.navigate(['/ecommerce/catalogue']);
  }
}