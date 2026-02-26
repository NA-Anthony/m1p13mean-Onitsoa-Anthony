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
import { LivraisonService } from '../livraison.service';
import { Livraison, STATUTS_LIVRAISON } from '../livraison.model';

@Component({
  selector: 'app-livraison-list',
  templateUrl: './livraison-list.component.html',
  styleUrls: ['./livraison-list.component.scss'],
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
export class LivraisonListComponent implements OnInit {
  livraisons: Livraison[] = [];
  filteredLivraisons: Livraison[] = [];
  searchTerm: string = '';
  filterStatut: string = '';
  
  statuts = STATUTS_LIVRAISON;

  constructor(
    private service: LivraisonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLivraisons();
  }

  loadLivraisons(): void {
    this.service.getLivraisons().subscribe({
      next: (data) => {
        this.livraisons = data;
        this.filteredLivraisons = data;
      }
    });
  }

  filterLivraisons(): void {
    this.filteredLivraisons = this.livraisons.filter(l => {
      const matchesSearch = this.searchTerm === '' || 
        l._id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.livreur?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.numeroSuivi?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.commande?._id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatut = this.filterStatut === '' || l.statut === this.filterStatut;
      
      return matchesSearch && matchesStatut;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/livraisons', id]);
  }

  deleteLivraison(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
      this.service.deleteLivraison(id).subscribe({
        next: () => this.loadLivraisons()
      });
    }
  }

  getStatutInfo(statut: string): { label: string, color: string } {
    return this.service.getStatutInfo(statut);
  }

  getTotalLivraisons(): number {
    return this.livraisons.length;
  }

  getTotalEnAttente(): number {
    return this.livraisons.filter(l => l.statut === 'en_attente').length;
  }

  getTotalEnCours(): number {
    return this.livraisons.filter(l => l.statut === 'en_cours').length;
  }

  getTotalLivrees(): number {
    return this.livraisons.filter(l => l.statut === 'livree').length;
  }

  getEstEnRetard(livraison: Livraison): boolean {
    if (livraison.statut === 'livree' || !livraison.dateEstimee) return false;
    return this.service.getRetardEstime(livraison.dateEstimee) > 0;
  }

  formatDate(date?: Date): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}