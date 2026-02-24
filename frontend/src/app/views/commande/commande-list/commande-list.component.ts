import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.scss'],
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
    IconModule
  ]
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
    private router: Router
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
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterCommandes(): void {
    this.filteredCommandes = this.commandes.filter(cmd => {
      const matchesSearch = this.searchTerm === '' || 
        (cmd._id && cmd._id.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatut = this.filterStatut === '' || cmd.statut === this.filterStatut;
      
      return matchesSearch && matchesStatut;
    });
  }

  voirDetails(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/commandes', id]);
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatutColor(statut: string | undefined): string {
    return this.statutColors[statut || ''] || 'secondary';
  }
}
