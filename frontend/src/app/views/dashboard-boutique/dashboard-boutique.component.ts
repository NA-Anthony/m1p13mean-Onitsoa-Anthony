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
  AlertModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { DashboardBoutiqueService } from '../../services/dashboard-boutique.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-boutique',
  templateUrl: './dashboard-boutique.component.html',
  styleUrls: ['./dashboard-boutique.component.scss'],
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
    ChartjsComponent,
    IconModule
  ]
})
export class DashboardBoutiqueComponent implements OnInit {
  boutiqueNom: string = '';
  boutiqueLogo: string = '';
  
  // États
  loading = true;
  error: string | null = null;
  
  // Statistiques
  stats = {
    produits: {
      total: 0,
      valeurStock: 0,
      stockFaible: [] as any[]
    },
    commandes: {
      total: 0,
      chiffreAffaires: 0,
      parStatut: {
        en_attente: 0,
        confirmée: 0,
        préparée: 0,
        expédiée: 0,
        livrée: 0,
        annulée: 0
      },
      dernieres: [] as any[],
      ventes7Jours: [] as any[]
    },
    avis: {
      total: 0,
      noteMoyenne: 0,
      repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      derniers: [] as any[]
    },
    promotions: {
      total: 0,
      actives: [] as any[]
    }
  };

  // Graphiques
  ventes7Jours: any = {
    labels: [],
    datasets: [
      {
        label: 'Ventes (€)',
        backgroundColor: '#2eb85c',
        borderColor: '#2eb85c',
        data: []
      }
    ]
  };

  repartitionVentes: any = {
    labels: ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#321fdb', '#f9b115', '#2eb85c', '#e55353', '#39f'],
        hoverBackgroundColor: ['#1b0e7c', '#d4950b', '#1f9b4a', '#b13b3b', '#0d6efd']
      }
    ]
  };

  constructor(
    private dashboardService: DashboardBoutiqueService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;
    
    this.dashboardService.getStats().subscribe({
      next: (response: any) => {
        this.boutiqueNom = response.boutique?.nom;
        this.boutiqueLogo = response.boutique?.logo;
        this.stats = response.stats;
        
        // Préparer les données des graphiques
        this.prepareGraphiques();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.msg || 'Erreur lors du chargement des données';
        this.loading = false;
        console.error(err);
      }
    });
  }

  prepareGraphiques(): void {
    // Graphique des ventes des 7 derniers jours
    this.ventes7Jours.labels = this.stats.commandes.ventes7Jours.map(v => v.date);
    this.ventes7Jours.datasets[0].data = this.stats.commandes.ventes7Jours.map(v => v.total);
    
    // Graphique de répartition des notes
    this.repartitionVentes.datasets[0].data = [
      this.stats.avis.repartition[1] || 0,
      this.stats.avis.repartition[2] || 0,
      this.stats.avis.repartition[3] || 0,
      this.stats.avis.repartition[4] || 0,
      this.stats.avis.repartition[5] || 0
    ];
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

  getNoteEtoiles(note: number): number[] {
    return [1, 2, 3, 4, 5];
  }

  getStockStatus(stock: number): { class: string, label: string } {
    if (stock === 0) return { class: 'danger', label: 'Rupture' };
    if (stock < 5) return { class: 'warning', label: 'Stock faible' };
    return { class: 'success', label: 'En stock' };
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

  formatMontant(montant: number): string {
    return (montant || 0).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' €';
  }

  getPourcentageSatisfaction(): number {
    if (this.stats.avis.total === 0) return 0;
    return (this.stats.avis.noteMoyenne / 5) * 100;
  }
}