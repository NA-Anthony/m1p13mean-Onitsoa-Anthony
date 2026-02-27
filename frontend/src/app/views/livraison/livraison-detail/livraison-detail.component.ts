import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  ProgressModule  // ← AJOUTER CET IMPORT
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { LivraisonService } from '../livraison.service';
import { Livraison, STATUTS_LIVRAISON } from '../livraison.model';

@Component({
  selector: 'app-livraison-detail',
  templateUrl: './livraison-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    ProgressModule,  // ← AJOUTER DANS LES IMPORTS
    IconModule
  ]
})
export class LivraisonDetailComponent implements OnInit {
  livraison: Livraison | null = null;
  statuts = STATUTS_LIVRAISON;

  constructor(
    private route: ActivatedRoute,
    private service: LivraisonService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getLivraisonById(id).subscribe({
        next: (data) => this.livraison = data || null
      });
    }
  }

  getStatutInfo(): { label: string, color: string } {
    if (!this.livraison) return { label: '', color: 'secondary' };
    return this.service.getStatutInfo(this.livraison.statut);
  }

  getEstEnRetard(): boolean {
    if (!this.livraison || this.livraison.statut === 'livree' || !this.livraison.dateEstimee) return false;
    return this.service.getRetardEstime(this.livraison.dateEstimee) > 0;
  }

  getJoursRestants(): number {
    if (!this.livraison?.dateEstimee || this.livraison.statut === 'livree') return 0;
    const now = new Date();
    const estimee = new Date(this.livraison.dateEstimee);
    const diff = estimee.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getProgression(): number {
    if (!this.livraison) return 0;
    
    switch(this.livraison.statut) {
      case 'en_attente': return 25;
      case 'en_cours': return 60;
      case 'livree': return 100;
      default: return 0;
    }
  }

  updateStatut(nouveauStatut: string): void {
    if (!this.livraison) return;
    
    this.service.updateStatut(this.livraison._id, nouveauStatut).subscribe({
      next: (updated) => {
        if (updated) this.livraison = updated;
      }
    });
  }

  formatDate(date?: Date): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(date?: Date): string {
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