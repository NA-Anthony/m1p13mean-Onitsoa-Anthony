import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  SpinnerModule,
  AlertModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AvisService } from '../../../services/avis.service';
import { AuthService } from '../../../services/auth.service';

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
    SpinnerModule,
    AlertModule,
    IconModule
  ]
})
export class AvisDetailComponent implements OnInit {
  avis: any = null;
  reponse: string = '';
  modeReponse: boolean = false;
  
  // États
  loading = true;
  error: string | null = null;
  
  // Rôles
  isAdmin = false;
  isBoutique = false;
  isAcheteur = false;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private avisService: AvisService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    const role = user?.role;
    this.isAdmin = role === 'admin';
    this.isBoutique = role === 'boutique';
    this.isAcheteur = role === 'acheteur';
    this.userId = user?._id;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAvis(id);
    }
  }

  loadAvis(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.avisService.getAvisById(id).subscribe({
      next: (data: any) => {
        this.avis = data;
        if (this.avis?.reponseBoutique) {
          this.reponse = this.avis.reponseBoutique.commentaire;
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.msg || 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getInitials(): string {
    if (!this.avis?.idAcheteur) return 'A';
    const prenom = this.avis.idAcheteur.prenom || '';
    const nom = this.avis.idAcheteur.nom || '';
    return (prenom[0] || '') + (nom[0] || '');
  }

  getNoteColor(): string {
    if (!this.avis) return 'secondary';
    if (this.avis.note >= 4) return 'success';
    if (this.avis.note >= 3) return 'warning';
    return 'danger';
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  peutModifier(): boolean {
    if (!this.avis) return false;
    if (this.isAdmin) return true;
    if (this.isAcheteur && this.avis.idAcheteur?._id === this.userId) return true;
    return false;
  }

  peutRepondre(): boolean {
    if (!this.avis || !this.isBoutique) return false;
    return this.avis.idProduitParBoutique?.idBoutique?._id === this.userId;
  }

  toggleReponse(): void {
    this.modeReponse = !this.modeReponse;
    if (!this.modeReponse && this.avis?.reponseBoutique) {
      this.reponse = this.avis.reponseBoutique.commentaire;
    }
  }

  envoyerReponse(): void {
    if (!this.avis || !this.reponse.trim()) return;
    
    this.avisService.repondreAvis(this.avis._id, this.reponse).subscribe({
      next: (updated: any) => {
        if (updated) {
          this.avis = updated;
          this.modeReponse = false;
        }
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'envoi de la réponse', err);
      }
    });
  }

  // SUPPRIMER la méthode supprimerReponse() ou la commenter
  /*
  supprimerReponse(): void {
    if (!this.avis || !confirm('Supprimer cette réponse ?')) return;
    
    this.avisService.updateAvis(this.avis._id, { reponseBoutique: undefined }).subscribe({
      next: (updated: any) => {
        if (updated) {
          this.avis = updated;
          this.reponse = '';
        }
      },
      error: (err: any) => {
        console.error('Erreur lors de la suppression', err);
      }
    });
  }
  */

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