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
import { BoutiqueService } from '../boutique/boutique.service';
import { ProduitParBoutiqueService } from '../produit-par-boutique/produit-par-boutique.service';
import { CommandeService } from '../commande/commande.service';
import { AvisService } from '../avis/avis.service';

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
    ChartjsComponent,
    IconModule
  ]
})
export class DashboardBoutiqueComponent implements OnInit {
  boutiqueId = '1'; // À remplacer par l'ID de la boutique connectée
  
  // Statistiques
  totalProduits = 0;
  totalCommandes = 0;
  totalAvis = 0;
  noteMoyenne = 0;
  chiffreAffaires = 0;
  valeurStock = 0;
  
  // Alertes stock
  stockFaible: any[] = [];
  
  // Derniers avis
  derniersAvis: any[] = [];
  
  // Dernières commandes
  dernieresCommandes: any[] = [];
  
  // Graphique ventes
  ventesParMois: any = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes',
        backgroundColor: '#2eb85c',
        data: [45, 52, 68, 74, 80, 72, 65, 58, 62, 75, 82, 88]
      }
    ]
  };

  constructor(
    private boutiqueService: BoutiqueService,
    private produitService: ProduitParBoutiqueService,
    private commandeService: CommandeService,
    private avisService: AvisService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadStockFaible();
    this.loadDerniersAvis();
    this.loadDernieresCommandes();
  }

  loadStats(): void {
    // Produits de la boutique
    this.produitService.getProduitsByBoutique(this.boutiqueId).subscribe(produits => {
      this.totalProduits = produits.length;
      this.valeurStock = produits.reduce((acc, p) => acc + (p.prix * p.stock), 0);
    });

    // Commandes de la boutique
    this.commandeService.getCommandesByBoutique(this.boutiqueId).subscribe(commandes => {
      this.totalCommandes = commandes.length;
      this.chiffreAffaires = commandes.reduce((acc, c) => acc + c.total, 0);
    });

    // Avis des produits de la boutique
    this.avisService.getAvis().subscribe(avis => {
      const avisBoutique = avis.filter(a => 
        a.produitParBoutique?.idBoutique === this.boutiqueId
      );
      this.totalAvis = avisBoutique.length;
      
      if (avisBoutique.length > 0) {
        const somme = avisBoutique.reduce((acc, a) => acc + a.note, 0);
        this.noteMoyenne = somme / avisBoutique.length;
      }
    });
  }

  loadStockFaible(): void {
    this.produitService.getProduitsByBoutique(this.boutiqueId).subscribe(produits => {
      this.stockFaible = produits
        .filter(p => p.stock > 0 && p.stock < 5)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);
    });
  }

  loadDerniersAvis(): void {
    this.avisService.getAvis().subscribe(avis => {
      this.derniersAvis = avis
        .filter(a => a.produitParBoutique?.idBoutique === this.boutiqueId)
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 3);
    });
  }

  loadDernieresCommandes(): void {
    this.commandeService.getCommandesByBoutique(this.boutiqueId).subscribe(commandes => {
      this.dernieresCommandes = commandes
        .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
        .slice(0, 5);
    });
  }

  getNoteEtoiles(note: number): number[] {
    return [1, 2, 3, 4, 5];
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