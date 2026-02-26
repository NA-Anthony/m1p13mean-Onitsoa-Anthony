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
  ProgressModule,
  ToastModule,
  SpinnerModule,
  AlertModule,
  ModalModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ProduitParBoutiqueService } from '../produit-par-boutique.service';
import { AuthService } from '../../../services/auth.service';

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
    ToastModule,
    SpinnerModule,
    AlertModule,
    ModalModule,
    IconModule
  ]
})
export class ProduitParBoutiqueListComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  loading = true;
  error: string | null = null;
  
  searchTerm: string = '';
  filterStock: string = 'tous';
  
  // Pour le modal de suppression
  showDeleteModal = false;
  itemToDelete: any = null;
  
  // Pour le modal de promotion
  showPromoModal = false;
  selectedItemForPromo: any = null;
  promoData = {
    remise: 0,
    dateDebut: '',
    dateFin: ''
  };
  promoSaving = false;
  promoError: string | null = null;
  today: string = new Date().toISOString().split('T')[0];
  
  // Pour les toasts
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';
  
  // Rôles
  isAdmin = false;
  isBoutique = false;

  constructor(
    private service: ProduitParBoutiqueService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    const role = user?.role;
    this.isAdmin = role === 'admin';
    this.isBoutique = role === 'boutique';
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.error = null;
    
    if (this.isAdmin) {
      // Admin voit tout
      this.service.getAllProduitsParBoutique().subscribe({
        next: (data) => {
          this.items = data || [];
          this.filteredItems = data || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.msg || 'Erreur lors du chargement';
          this.loading = false;
          console.error(err);
        }
      });
    } else if (this.isBoutique) {
      // Boutique voit ses produits seulement
      this.service.getMesProduits().subscribe({
        next: (data) => {
          this.items = data || [];
          this.filteredItems = data || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.msg || 'Erreur lors du chargement';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  filterItems(): void {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = this.searchTerm === '' || 
        item.idProduit?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.idBoutique?.nomBoutique?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStock = this.filterStock === 'tous' || 
        (this.filterStock === 'en_stock' && item.stock > 0) ||
        (this.filterStock === 'alerte' && item.stock > 0 && item.stock < 5) ||
        (this.filterStock === 'rupture' && item.stock === 0);
      
      return matchesSearch && matchesStock;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/produits-par-boutique', id]);
  }

  editItem(id: string, event: Event): void {
    event.stopPropagation();
    if (this.isAdmin) {
      this.showToastMessage('Les administrateurs ne peuvent pas modifier les produits', 'danger');
      return;
    }
    this.router.navigate(['/produits-par-boutique', id, 'edit']);
  }

  confirmDelete(item: any, event: Event): void {
    event.stopPropagation();
    if (this.isAdmin) {
      this.showToastMessage('Les administrateurs ne peuvent pas supprimer les produits', 'danger');
      return;
    }
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  deleteItem(): void {
    if (!this.itemToDelete) return;
    
    this.service.deleteProduitParBoutique(this.itemToDelete._id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.itemToDelete = null;
        this.showToastMessage('Produit supprimé avec succès', 'success');
        this.loadItems();
      },
      error: (err) => {
        this.showDeleteModal = false;
        this.showToastMessage(err.error?.msg || 'Erreur lors de la suppression', 'danger');
        console.error(err);
      }
    });
  }

  // Gestion de la promotion
  openPromoModal(item: any, event: Event): void {
    event.stopPropagation();
    if (this.isAdmin) {
      this.showToastMessage('Les administrateurs ne peuvent pas gérer les promotions', 'danger');
      return;
    }
    this.selectedItemForPromo = item;
    this.promoData = {
      remise: 0,
      dateDebut: this.today,
      dateFin: ''
    };
    this.promoError = null;
    this.showPromoModal = true;
  }

  closePromoModal(): void {
    this.showPromoModal = false;
    this.selectedItemForPromo = null;
    this.promoData = {
      remise: 0,
      dateDebut: '',
      dateFin: ''
    };
    this.promoError = null;
    this.promoSaving = false;
  }

  getPrixPromo(prix: number, remise: number): number {
    if (!remise) return prix;
    return prix - (prix * remise / 100);
  }

  // Vérifier si la date de fin est invalide (strictement avant la date de début)
  isDateFinAvantDebut(): boolean {
    if (!this.promoData.dateDebut || !this.promoData.dateFin) return false;
    
    const debut = new Date(this.promoData.dateDebut);
    const fin = new Date(this.promoData.dateFin);
    
    // Remettre à minuit pour la comparaison
    debut.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    return fin < debut; // Strictement avant
  }

  // Vérifier si la promotion est valide
  isPromoValid(): boolean {
    if (!this.promoData.remise || this.promoData.remise < 1 || this.promoData.remise > 100) return false;
    if (!this.promoData.dateDebut) return false;
    if (!this.promoData.dateFin) return false;
    
    // Vérifier que la date de fin n'est pas avant la date de début
    if (this.isDateFinAvantDebut()) return false;
    
    return true;
  }

  savePromotion(): void {
    if (!this.selectedItemForPromo || !this.isPromoValid()) return;
  
    this.promoSaving = true;
    this.promoError = null;
  
    const promotionData = {
      remisePourcentage: this.promoData.remise,
      dateDebut: this.promoData.dateDebut,
      dateFin: this.promoData.dateFin
    };
  
    this.service.ajouterPromotion(this.selectedItemForPromo._id, promotionData).subscribe({
      next: (response: any) => {
        // Mettre à jour l'item dans la liste
        const index = this.items.findIndex(i => i && i._id === this.selectedItemForPromo._id);
        if (index !== -1) {
          this.items[index] = response.produit || response;
          this.filteredItems = [...this.items];
          this.filterItems();
        }
        
        this.showToastMessage(response.message || 'Promotion ajoutée avec succès', 'success');
        this.closePromoModal();
        this.promoSaving = false;
      },
      error: (err: any) => {
        // Afficher le message d'erreur spécifique
        this.promoError = err.error?.msg || 'Erreur lors de l\'ajout de la promotion';
        this.promoSaving = false;
        console.error(err);
      }
    });
  }

  getStockStatus(stock: number): { class: string, label: string } {
    if (stock === 0) return { class: 'danger', label: 'Rupture' };
    if (stock < 5) return { class: 'warning', label: 'Stock faible' };
    return { class: 'success', label: 'En stock' };
  }

  getTotalItems(): number {
    return this.items.length;
  }

  getTotalValeurStock(): number {
    return (this.items || []).reduce((acc, item) => {
      if (!item) return acc;
      const prix = item.enPromotion && item.prixPromo ? item.prixPromo : (item.prix || 0);
      return acc + (prix * (item.stock || 0));
    }, 0);
  }

  getTotalEnPromotion(): number {
    if (!this.items || !Array.isArray(this.items)) return 0;
    return this.items.filter(item => item && item.enPromotion === true).length;
  }

  getTotalRupture(): number {
    return this.items.filter(i => i.stock === 0).length;
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