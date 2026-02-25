import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  SpinnerModule,
  AlertModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ProduitParBoutiqueService } from '../produit-par-boutique.service';
import { AuthService } from '../../../services/auth.service';

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
    SpinnerModule,
    AlertModule,
    IconModule
  ]
})
export class ProduitParBoutiqueDetailComponent implements OnInit {
  item: any = null;
  quantiteInput: number = 0;
  
  // États
  loading = true;
  error: string | null = null;
  showPromoForm = false;
  
  // Données promotion
  promoRemise: number = 0;
  promoDateDebut: string = '';
  promoDateFin: string = '';
  today: string = new Date().toISOString().split('T')[0];
  
  // Historique des promotions
  historiquePromotions: any[] = [];
  showHistorique = false;
  
  // Rôles
  isAdmin = false;
  isBoutique = false;

  constructor(
    private route: ActivatedRoute,
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadItem(id);
    }
  }

  loadItem(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.service.getProduitParBoutiqueById(id).subscribe({
      next: (data: any) => {
        this.item = data;
        if (this.item) {
          this.quantiteInput = this.item.stock;
        }
        this.loading = false;
        this.loadHistoriquePromotions();
      },
      error: (err: any) => {
        this.error = err.error?.msg || 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadHistoriquePromotions(): void {
    if (!this.item) return;
    
    this.service.getHistoriquePromotions(this.item._id).subscribe({
      next: (data: any[]) => {
        this.historiquePromotions = data;
      },
      error: (err: any) => {
        console.error('Erreur chargement historique:', err);
      }
    });
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
      next: (updated: any) => {
        if (updated) {
          this.item = updated;
          alert('Stock mis à jour avec succès');
        }
      },
      error: (err: any) => {
        alert(err.error?.msg || 'Erreur lors de la mise à jour');
        console.error(err);
      }
    });
  }

  ajouterPromotion(): void {
    if (!this.item) return;
    
    if (!this.promoRemise || this.promoRemise < 1 || this.promoRemise > 100) {
      alert('La remise doit être entre 1 et 100%');
      return;
    }
    
    if (!this.promoDateDebut || !this.promoDateFin) {
      alert('Veuillez saisir les dates');
      return;
    }
    
    if (new Date(this.promoDateFin) <= new Date(this.promoDateDebut)) {
      alert('La date de fin doit être après la date de début');
      return;
    }

    // Vérifier s'il y a déjà une promotion
    const aDejaPromo = this.item.enPromotion;
    
    let messageConfirmation = 'Êtes-vous sûr de vouloir ajouter cette promotion ?';
    
    if (aDejaPromo) {
      messageConfirmation = '⚠️ ATTENTION : Ce produit a déjà une promotion active.\n\n' +
        'En ajoutant cette nouvelle promotion :\n' +
        '• L\'ancienne promotion sera désactivée\n' +
        '• Si les dates de la nouvelle promotion sont dans le futur, elle sera programmée\n' +
        '• Si les dates sont actuelles, elle deviendra active immédiatement\n\n' +
        'Voulez-vous continuer ?';
    }

    if (!confirm(messageConfirmation)) {
      return;
    }

    const promotionData = {
      remisePourcentage: this.promoRemise,
      dateDebut: this.promoDateDebut,
      dateFin: this.promoDateFin
    };

    this.service.ajouterPromotion(this.item._id, promotionData).subscribe({
      next: (response: any) => {
        this.item = response.produit;
        this.showPromoForm = false;
        this.promoRemise = 0;
        this.promoDateDebut = '';
        this.promoDateFin = '';
        
        // Afficher le message de l'API
        if (response.message) {
          alert(response.message);
        }
        
        // Recharger l'historique
        this.loadHistoriquePromotions();
      },
      error: (err: any) => {
        alert(err.error?.msg || 'Erreur lors de l\'ajout de la promotion');
        console.error(err);
      }
    });
  }

  supprimerPromotion(): void {
    if (!this.item || !confirm('⚠️ Voulez-vous vraiment supprimer cette promotion ?')) return;
    
    this.service.supprimerPromotion(this.item._id).subscribe({
      next: (response: any) => {
        this.item = response.produit;
        if (response.message) {
          alert(response.message);
        }
        this.loadHistoriquePromotions();
      },
      error: (err: any) => {
        alert(err.error?.msg || 'Erreur lors de la suppression');
        console.error(err);
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

  formatDateSimple(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}