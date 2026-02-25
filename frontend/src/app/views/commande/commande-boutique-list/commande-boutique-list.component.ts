import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule, TableModule, ButtonModule, BadgeModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommandeService } from '../commande.service';

@Component({
  selector: 'app-commande-boutique-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, TableModule, ButtonModule, BadgeModule, IconModule],
  templateUrl: './commande-boutique-list.component.html'
})
export class CommandeBoutiqueListComponent implements OnInit {
  commandes: any[] = [];
  loading = true;
  error: string | null = null;
  statuts = ['en_attente','confirmée','préparée','expédiée','livrée','annulée'];

  constructor(private service: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading = true;
    this.service.getCommandesBoutique().subscribe({
      next: (data: any[]) => { this.commandes = data; this.loading = false; },
      error: (err) => { this.error = 'Erreur chargement commandes'; console.error(err); this.loading = false; }
    });
  }

  changeStatut(cmdId: string, statut: string): void {
    this.service.updateStatut(cmdId, statut).subscribe({
      next: () => this.loadCommandes(),
      error: (err) => { alert(err?.error?.msg || 'Erreur mise à jour statut'); console.error(err); }
    });
  }
}
