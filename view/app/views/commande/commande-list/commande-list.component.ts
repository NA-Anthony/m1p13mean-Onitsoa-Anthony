import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommandeService } from '../commande.service';
import { Commande, STATUTS_COMMANDE } from '../commande.model';

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
    AvatarModule,
    ButtonModule,
    BadgeModule,
    IconModule
  ]
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  filteredCommandes: Commande[] = [];
  searchTerm: string = '';
  filterStatut: string = '';
  filterPeriode: string = 'tous';
  
  statuts = STATUTS_COMMANDE;

  constructor(
    private service: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.service.getCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
        this.filteredCommandes = data;
      }
    });
  }

  filterCommandes(): void {
    this.filteredCommandes = this.commandes.filter(cmd => {
      const matchesSearch = this.searchTerm === '' || 
        cmd._id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cmd.acheteur?.telephone?.includes(this.searchTerm) ||
        cmd.boutique?.nomBoutique.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatut = this.filterStatut === '' || cmd.statut === this.filterStatut;
      
      let matchesPeriode = true;
      if (this.filterPeriode !== 'tous') {
        const now = new Date();
        const cmdDate = new Date(cmd.dateCommande);
        const diff = now.getTime() - cmdDate.getTime();
        const jours = diff / (1000 * 60 * 60 * 24);
        
        if (this.filterPeriode === '7j') matchesPeriode = jours <= 7;
        else if (this.filterPeriode === '30j') matchesPeriode = jours <= 30;
        else if (this.filterPeriode === '90j') matchesPeriode = jours <= 90;
      }
      
      return matchesSearch && matchesStatut && matchesPeriode;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/commandes', id]);
  }

  getStatutInfo(statut: string): { label: string, color: string } {
    return this.service.getStatutInfo(statut);
  }

  getTotalCommandes(): number {
    return this.commandes.length;
  }

  getTotalCA(): number {
    return this.commandes.reduce((acc, c) => acc + c.total, 0);
  }

  getTotalEnAttente(): number {
    return this.commandes.filter(c => c.statut === 'en_attente').length;
  }

  getTotalLivrees(): number {
    return this.commandes.filter(c => c.statut === 'livrée').length;
  }

  getMoyenneParCommande(): number {
    if (this.commandes.length === 0) return 0;
    return this.getTotalCA() / this.commandes.length;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  deleteCommande(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.service.deleteCommande(id).subscribe({
        next: () => this.loadCommandes()
      });
    }
  }
}