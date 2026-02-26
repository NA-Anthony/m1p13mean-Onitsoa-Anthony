import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  ButtonModule,
  BadgeModule,
  TableModule,
  SpinnerModule, 
  AlertModule   
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommandeService } from '../commande.service';
import { Commande } from '../commande.model';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    GridModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    SpinnerModule,
    AlertModule,  
    IconModule
  ],
  styles: [`
    .bg-primary-soft { background-color: rgba(var(--cui-primary-rgb), 0.1); }
    .border-primary-soft { border-color: rgba(var(--cui-primary-rgb), 0.2); }
    thead th {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--cui-secondary);
      font-weight: 700;
    }
  `]
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  filteredCommandes: Commande[] = [];
  searchTerm: string = '';
  filterStatut: string = '';
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
    private commandeService: CommandeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading = true;
    this.error = null;
    this.commandeService.getMesCommandes().subscribe({
      next: (data: any) => {
        this.commandes = data;
        this.filteredCommandes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des commandes';
        this.loading = false;
      }
    });
  }

  filterCommandes(): void {
    this.filteredCommandes = this.commandes.filter(cmd => {
      const idStr = (cmd._id || '').toString();
      const matchesSearch = this.searchTerm === '' || 
                            idStr.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatut = this.filterStatut === '' || cmd.statut === this.filterStatut;
      return matchesSearch && matchesStatut;
    });
  }

  voirDetails(id: string | undefined): void {
    if (id) {
        // Navigation relative : on ajoute l'ID à la route actuelle
        this.router.navigate([id], { relativeTo: this.route });
      }
    }

  formatDate(date: any): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStatutColor(statut: string | undefined): string {
    return this.statutColors[statut || ''] || 'secondary';
  }
}