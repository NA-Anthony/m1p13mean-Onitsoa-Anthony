import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  ButtonModule,
  BadgeModule,
  TableModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { UserService } from '../user/user.service';
import { BoutiqueService } from '../boutique/boutique.service';
import { CommandeService } from '../commande/commande.service';
import { ProduitService } from '../produit/produit.service';

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
    ChartjsComponent,
    IconModule
  ]
})
export class DashboardAdminComponent implements OnInit {
  // Statistiques
  totalUsers = 0;
  totalBoutiques = 0;
  totalCommandes = 0;
  totalProduits = 0;
  chiffreAffaires = 0;
  
  // Données pour les graphiques
  commandesParMois: any = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Commandes',
        backgroundColor: '#321fdb',
        data: [65, 59, 80, 81, 56, 55, 40, 48, 70, 75, 85, 90]
      }
    ]
  };
  
  repartitionVentes: any = {
    labels: ['Électronique', 'Habillement', 'Alimentaire', 'Maison', 'Autre'],
    datasets: [
      {
        data: [300, 250, 180, 120, 80],
        backgroundColor: ['#321fdb', '#f9b115', '#2eb85c', '#e55353', '#39f'],
        hoverBackgroundColor: ['#1b0e7c', '#d4950b', '#1f9b4a', '#b13b3b', '#0d6efd']
      }
    ]
  };

  // Top boutiques
  topBoutiques: any[] = [];
  
  // Dernières commandes
  dernieresCommandes: any[] = [];

  constructor(
    private userService: UserService,
    private boutiqueService: BoutiqueService,
    private commandeService: CommandeService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadTopBoutiques();
    this.loadDernieresCommandes();
  }

  loadStats(): void {
    this.userService.getUsers().subscribe(users => {
      this.totalUsers = users.length;
    });

    this.boutiqueService.getBoutiques().subscribe(boutiques => {
      this.totalBoutiques = boutiques.length;
    });

    this.commandeService.getCommandes().subscribe(commandes => {
      this.totalCommandes = commandes.length;
      this.chiffreAffaires = commandes.reduce((acc, c) => acc + c.total, 0);
    });

    this.produitService.getProduits().subscribe(produits => {
      this.totalProduits = produits.length;
    });
  }

  loadTopBoutiques(): void {
    this.boutiqueService.getBoutiques().subscribe(boutiques => {
      this.topBoutiques = boutiques
        .sort((a, b) => b.noteMoyenne - a.noteMoyenne)
        .slice(0, 5);
    });
  }

  loadDernieresCommandes(): void {
    this.commandeService.getCommandes().subscribe(commandes => {
      this.dernieresCommandes = commandes
        .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
        .slice(0, 5);
    });
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}