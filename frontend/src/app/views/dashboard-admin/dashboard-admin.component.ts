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
  AvatarModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { DashboardAdminService } from '../../services/dashboard-admin.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
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
    AvatarModule,
    ChartjsComponent,
    IconModule
  ]
})
export class DashboardAdminComponent implements OnInit {
  // États
  loading = true;
  error: string | null = null;

  // Statistiques
  stats = {
    users: {
      total: 0,
      admins: 0,
      boutiques: 0,
      acheteurs: 0,
      actifs: 0
    },
    boutiques: {
      total: 0,
      avecAvis: 0,
      noteMoyenne: 0,
      topBoutiques: [] as any[]
    },
    produits: {
      total: 0,
      parCategorie: [] as any[]
    },
    commandes: {
      total: 0,
      parStatut: [] as any[],
      chiffreAffaires: 0,
      parMois: [] as any[],
      dernieres: [] as any[]
    },
    avis: {
      total: 0,
      avecReponse: 0,
      repartitionNotes: [] as any[]
    },
    promotions: {
      total: 0,
      actives: 0
    }
  };

  // Graphiques
  evolutionCommandes: any = {
    labels: [],
    datasets: [
      {
        label: 'Commandes',
        backgroundColor: '#321fdb',
        borderColor: '#321fdb',
        data: []
      }
    ]
  };

  evolutionCA: any = {
    labels: [],
    datasets: [
      {
        label: 'Chiffre d\'affaires (€)',
        backgroundColor: '#2eb85c',
        borderColor: '#2eb85c',
        data: []
      }
    ]
  };

  repartitionNotes: any = {
    labels: ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#e55353', '#f9b115', '#39f', '#2eb85c', '#321fdb'],
        hoverBackgroundColor: ['#b13b3b', '#d4950b', '#0d6efd', '#1f9b4a', '#1b0e7c']
      }
    ]
  };

  repartitionCategorie: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#321fdb', '#f9b115', '#2eb85c', '#e55353', '#39f', '#6f42c1', '#fd7e14'],
        hoverBackgroundColor: ['#1b0e7c', '#d4950b', '#1f9b4a', '#b13b3b', '#0d6efd', '#5a32a3', '#e66a02']
      }
    ]
  };

  statutsCommandes: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f9b115', '#39f', '#321fdb', '#321fdb', '#2eb85c', '#e55353'],
        hoverBackgroundColor: ['#d4950b', '#0d6efd', '#1b0e7c', '#1b0e7c', '#1f9b4a', '#b13b3b']
      }
    ]
  };

  constructor(private dashboardService: DashboardAdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getStats().subscribe({
      next: (response: any) => {
        this.stats = response;
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
    // Évolution des commandes et CA
    this.evolutionCommandes.labels = this.stats.commandes.parMois.map((m: any) => m.mois);
    this.evolutionCommandes.datasets[0].data = this.stats.commandes.parMois.map((m: any) => m.commandes);
    
    this.evolutionCA.labels = this.stats.commandes.parMois.map((m: any) => m.mois);
    this.evolutionCA.datasets[0].data = this.stats.commandes.parMois.map((m: any) => m.ca);

    // Répartition des notes
    const notesData = [0, 0, 0, 0, 0];
    this.stats.avis.repartitionNotes.forEach((n: any) => {
      if (n._id >= 1 && n._id <= 5) {
        notesData[n._id - 1] = n.count;
      }
    });
    this.repartitionNotes.datasets[0].data = notesData;

    // Répartition des catégories
    this.repartitionCategorie.labels = this.stats.produits.parCategorie.map((c: any) => c._id);
    this.repartitionCategorie.datasets[0].data = this.stats.produits.parCategorie.map((c: any) => c.count);

    // Répartition des statuts de commandes
    const statutsMap: any = {
      'en_attente': 'En attente',
      'confirmée': 'Confirmée',
      'préparée': 'Préparée',
      'expédiée': 'Expédiée',
      'livrée': 'Livrée',
      'annulée': 'Annulée'
    };
    
    this.statutsCommandes.labels = this.stats.commandes.parStatut.map((s: any) => statutsMap[s._id] || s._id);
    this.statutsCommandes.datasets[0].data = this.stats.commandes.parStatut.map((s: any) => s.count);
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

  getTauxConversion(): number {
    if (this.stats.users.total === 0) return 0;
    return (this.stats.commandes.total / this.stats.users.total) * 100;
  }

  getTauxReponse(): number {
    if (this.stats.avis.total === 0) return 0;
    return (this.stats.avis.avecReponse / this.stats.avis.total) * 100;
  }

  getPourcentageActifs(): number {
    if (this.stats.users.total === 0) return 0;
    return (this.stats.users.actifs / this.stats.users.total) * 100;
  }

  formatDate(date: Date): string {
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
}