import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  TableModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommandeService } from '../commande.service';
import { Commande, STATUTS_COMMANDE } from '../commande.model';

@Component({
  selector: 'app-commande-detail',
  templateUrl: './commande-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    IconModule
  ]
})
export class CommandeDetailComponent implements OnInit {
  commande: Commande | null = null;
  statuts = STATUTS_COMMANDE;

  constructor(
    private route: ActivatedRoute,
    private service: CommandeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getCommandeById(id).subscribe({
        next: (data) => this.commande = data || null
      });
    }
  }

  getStatutInfo(): { label: string, color: string } {
    if (!this.commande) return { label: '', color: 'secondary' };
    return this.service.getStatutInfo(this.commande.statut);
  }

  getSousTotal(): number {
    if (!this.commande) return 0;
    return this.commande.articles.reduce((acc, a) => {
      const prix = a.prixUnitaire - a.remise;
      return acc + (prix * a.quantite);
    }, 0);
  }

  getTotalTTC(): number {
    if (!this.commande) return 0;
    return this.getSousTotal() + this.commande.fraisLivraison;
  }

  updateStatut(nouveauStatut: string): void {
    if (!this.commande) return;
    
    this.service.updateStatut(this.commande._id, nouveauStatut).subscribe({
      next: (updated) => {
        if (updated) this.commande = updated;
      }
    });
  }

  togglePaiement(): void {
    if (!this.commande) return;
    
    this.service.togglePaiement(this.commande._id).subscribe({
      next: (updated) => {
        if (updated) this.commande = updated;
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
}