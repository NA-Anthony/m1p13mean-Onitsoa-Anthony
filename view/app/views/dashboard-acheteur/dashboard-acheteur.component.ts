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
import { CommandeService } from '../commande/commande.service';
import { AvisService } from '../avis/avis.service';
import { AcheteurService } from '../acheteur/acheteur.service';
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
    IconModule
  ]
})
export class DashboardAcheteurComponent implements OnInit {
  acheteurId = '1'; // À remplacer par l'ID de l'acheteur connecté
  
  // Statistiques
  totalCommandes = 0;
  totalDepenses = 0;
  totalAvis = 0;
  panierActuel = 0;
  
  // Commandes
  commandesEnCours: any[] = [];
  historiqueCommandes: any[] = [];
  
  // Derniers avis
  derniersAvis: any[] = [];
  
  // Recommandations (simulées)
  recommandations: any[] = [
    { nom: 'Smartphone Galaxy', prix: 699.99, boutique: 'Boutique Parisienne' },
    { nom: 'Jean slim', prix: 49.99, boutique: 'Shop Lyon' },
    { nom: 'Enceinte Bluetooth', prix: 79.99, boutique: 'Boutique Parisienne' }
  ];

  constructor(
    private commandeService: CommandeService,
    private avisService: AvisService,
    private acheteurService: AcheteurService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCommandes();
    this.loadAvis();
    this.panierActuel = this.cartService.totalItems();
  }

  loadStats(): void {
    this.commandeService.getCommandesByAcheteur(this.acheteurId).subscribe(commandes => {
      this.totalCommandes = commandes.length;
      this.totalDepenses = commandes.reduce((acc, c) => acc + c.total, 0);
      
      this.commandesEnCours = commandes.filter(c => 
        !['livrée', 'annulée'].includes(c.statut)
      );
      
      this.historiqueCommandes = commandes
        .filter(c => ['livrée', 'annulée'].includes(c.statut))
        .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
        .slice(0, 5);
    });

    this.avisService.getAvisByAcheteur(this.acheteurId).subscribe(avis => {
      this.totalAvis = avis.length;
    });
  }

  loadCommandes(): void {
    this.commandeService.getCommandesByAcheteur(this.acheteurId).subscribe(commandes => {
      this.commandesEnCours = commandes.filter(c => 
        !['livrée', 'annulée'].includes(c.statut)
      );
    });
  }

  loadAvis(): void {
    this.avisService.getAvisByAcheteur(this.acheteurId).subscribe(avis => {
      this.derniersAvis = avis
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 3);
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}