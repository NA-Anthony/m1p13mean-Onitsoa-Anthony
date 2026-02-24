import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  ButtonModule,
  BadgeModule,
  TableModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommandeService } from '../commande.service';
import { Commande } from '../commande.model';

@Component({
  selector: 'app-commande-detail',
  templateUrl: './commande-detail.component.html',
  styleUrls: ['./commande-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    IconModule
  ]
})
export class CommandeDetailComponent implements OnInit {
  commande: Commande | null = null;
  loading = true;
  error: string | null = null;

  statutColors: Record<string, string> = {
    'en_attente': 'warning',
    'confirmée': 'info',
    'préparée': 'primary',
    'expédiée': 'secondary',
    'livrée': 'success',
    'annulée': 'danger'
  };

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCommande(id);
    }
  }

  loadCommande(id: string): void {
    this.loading = true;
    this.error = null;
    this.commandeService.getCommandeById(id).subscribe({
      next: (data: any) => {
        this.commande = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la commande';
        console.error(err);
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatutColor(statut: string | undefined): string {
    return this.statutColors[statut || ''] || 'secondary';
  }

  getSousTotal(): number {
    if (!this.commande?.articles) return 0;
    return this.commande.articles.reduce((acc, a) => {
      const prix = a.prixUnitaire - (a.remise || 0);
      return acc + (prix * a.quantite);
    }, 0);
  }
}
