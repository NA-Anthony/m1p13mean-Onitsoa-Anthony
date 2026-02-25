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
// import { AvisService } from '../avis/avis.service';
import { PortefeuilleService } from '../ecommerce/portefeuille.service';

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
  caisseBoutique = 0;

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
    // private avisService: AvisService,
    private portefeuilleService: PortefeuilleService
  ) { }

  ngOnInit(): void {
    this.loadStats();
    this.chargerCaisse();
    this.loadStockFaible();
    // this.loadDerniersAvis();
    this.loadDernieresCommandes();
  }

  chargerCaisse(): void {
    this.portefeuilleService.getCaisseBoutique().subscribe({
      next: (res) => this.caisseBoutique = res.caisse,
      error: (err) => console.error(err)
    });
  }

  loadStats(): void {
    // Produits de la boutique
    this.produitService.getProduitsByBoutique(this.boutiqueId).subscribe((produits: any[]) => {
      this.totalProduits = produits.length;
      this.valeurStock = produits.reduce((acc: number, p: any) => acc + (p.prix * p.stock), 0);
    });

    // Commandes de la boutique
    this.commandeService.getCommandesBoutique().subscribe((commandes: any[]) => {
      this.totalCommandes = commandes.length;
      this.chiffreAffaires = commandes.reduce((acc: number, c: any) => acc + (c.total || 0), 0);
    });

    // Avis des produits de la boutique
    /*
    this.avisService.getAvis().subscribe(avis => {
      // ...
    });
    */
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