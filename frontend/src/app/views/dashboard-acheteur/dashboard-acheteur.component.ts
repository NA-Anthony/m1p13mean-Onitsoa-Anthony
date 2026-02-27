import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  ButtonModule,
  BadgeModule,
  TableModule,
  ProgressModule,
  SpinnerModule,
  AlertModule,
  AvatarModule  // ← AJOUTER CET IMPORT
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { DashboardAcheteurService } from '../../services/dashboard-acheteur.service';
import { CartService } from '../ecommerce/cart.service';

@Component({
  selector: 'app-dashboard-acheteur',
  templateUrl: './dashboard-acheteur.component.html',
  styleUrls: ['./dashboard-acheteur.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    ProgressModule,
    SpinnerModule,
    AlertModule,
    AvatarModule,  // ← AJOUTER DANS LES IMPORTS
    ChartjsComponent,
    IconModule
  ]
})
export class DashboardAcheteurComponent implements OnInit {
  // Informations acheteur
  telephone: string = '';
  adresse: string = '';
  
  // États
  loading = true;
  error: string | null = null;
  
  // Commandes en cours
  commandesEnCours: any[] = [];
  
  // Statistiques
  stats = {
    commandes: {
      total: 0,
      enCours: 0,
      livrees: 0,
      totalDepenses: 0,
      dernieres: [] as any[],
      depensesParMois: [] as any[]
    },
    avis: {
      total: 0,
      derniers: [] as any[]
    },
    recommandations: [] as any[]
  };

  // Graphique des dépenses
  depensesChart: any = {
    labels: [],
    datasets: [
      {
        label: 'Dépenses (€)',
        backgroundColor: '#321fdb',
        borderColor: '#321fdb',
        data: []
      }
    ]
  };

  // Panier
  panierActuel: number = 0;

  constructor(
    private dashboardService: DashboardAcheteurService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.panierActuel = this.cartService.totalItems();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;
    
    this.dashboardService.getStats().subscribe({
      next: (response: any) => {
        this.telephone = response.acheteur?.telephone;
        this.adresse = this.formatAdresse(response.acheteur?.adresse);
        this.stats = response.stats;
        
        // Préparer les commandes en cours
        this.prepareCommandesEnCours();
        
        // Préparer le graphique des dépenses
        this.prepareDepensesChart();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.msg || 'Erreur lors du chargement des données';
        this.loading = false;
        console.error(err);
      }
    });
  }

  prepareCommandesEnCours(): void {
    this.commandesEnCours = this.stats.commandes.dernieres.filter(
      (c: any) => !['livrée', 'annulée'].includes(c.statut)
    );
  }

  prepareDepensesChart(): void {
    this.depensesChart.labels = this.stats.commandes.depensesParMois.map((d: any) => d.mois);
    this.depensesChart.datasets[0].data = this.stats.commandes.depensesParMois.map((d: any) => d.total);
  }

  getStatutClass(statut: string): string {
    const classes: any = {
      'en_attente': 'warning',
      'confirmée': 'info',
      'préparée': 'primary',
      'expédiée': 'primary',
      'livrée': 'success',
      'annulée': 'danger'
    };
    return classes[statut] || 'secondary';
  }

  getProgressValue(statut: string): number {
    const valeurs: any = {
      'en_attente': 20,
      'confirmée': 40,
      'préparée': 60,
      'expédiée': 80,
      'livrée': 100,
      'annulée': 100
    };
    return valeurs[statut] || 0;
  }

  getNoteEtoiles(note: number): number[] {
    return [1, 2, 3, 4, 5];
  }

  getPrixReel(produit: any): number {
    return produit.enPromotion && produit.prixPromo ? produit.prixPromo : produit.prix;
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
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

  formatMontant(montant: number): string {
    return (montant || 0).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' €';
  }

  formatAdresse(adresse: any): string {
    if (!adresse) return 'Non renseignée';
    return `${adresse.rue || ''}, ${adresse.codePostal || ''} ${adresse.ville || ''}`.trim();
  }

  ajouterAuPanier(produit: any): void {
    this.cartService.ajouterAuPanier({
      idProduitParBoutique: produit._id,
      idBoutique: produit.idBoutique || '',
      nomProduit: produit.nom,
      nomBoutique: produit.boutique || '',
      prix: produit.prix,
      quantite: 1,
      stock: 999,
      image: produit.image,
      enPromotion: produit.enPromotion,
      prixPromo: produit.prixPromo
    });
    
    this.panierActuel = this.cartService.totalItems();
    alert('Produit ajouté au panier !');
  }
}