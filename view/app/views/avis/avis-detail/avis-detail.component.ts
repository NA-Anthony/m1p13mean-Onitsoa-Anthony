import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AvisService } from '../avis.service';
import { Avis } from '../avis.model';

@Component({
  selector: 'app-avis-detail',
  templateUrl: './avis-detail.component.html',
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
export class AvisDetailComponent implements OnInit {
  avis: Avis | null = null;
  reponse: string = '';
  modeReponse: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: AvisService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getAvisById(id).subscribe({
        next: (data) => {
          this.avis = data || null;
          if (this.avis?.reponseBoutique) {
            this.reponse = this.avis.reponseBoutique.commentaire;
          }
        }
      });
    }
  }

  getInitials(): string {
    if (!this.avis?.acheteur?.telephone) return 'A';
    return this.avis.acheteur.telephone.substring(0, 2);
  }

  getNoteColor(): string {
    if (!this.avis) return 'secondary';
    return this.service.getNoteColor(this.avis.note);
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  toggleReponse(): void {
    this.modeReponse = !this.modeReponse;
    if (!this.modeReponse && this.avis?.reponseBoutique) {
      this.reponse = this.avis.reponseBoutique.commentaire;
    }
  }

  envoyerReponse(): void {
    if (!this.avis || !this.reponse.trim()) return;
    
    this.service.repondreAvis(this.avis._id, this.reponse).subscribe({
      next: (updated) => {
        if (updated) {
          this.avis = updated;
          this.modeReponse = false;
        }
      }
    });
  }

  supprimerReponse(): void {
    if (!this.avis || !confirm('Supprimer cette réponse ?')) return;
    
    this.service.updateAvis(this.avis._id, { reponseBoutique: undefined }).subscribe({
      next: (updated) => {
        if (updated) {
          this.avis = updated;
          this.reponse = '';
        }
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