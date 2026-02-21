import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { PromotionService } from '../promotion.service';
import { Promotion } from '../promotion.model';

@Component({
  selector: 'app-promotion-detail',
  templateUrl: './promotion-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    ProgressModule,
    IconModule
  ]
})
export class PromotionDetailComponent implements OnInit {
  promotion: Promotion | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: PromotionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getPromotionById(id).subscribe({
        next: (data) => this.promotion = data || null
      });
    }
  }

  getStatut(): { class: string, label: string } {
    if (!this.promotion) return { class: 'secondary', label: 'Inconnu' };
    
    const isActive = this.service.isPromotionActive(this.promotion);
    if (!this.promotion.actif) return { class: 'secondary', label: 'Désactivée' };
    if (isActive) return { class: 'success', label: 'Active' };
    return { class: 'warning', label: 'Expirée' };
  }

  getRemainingDays(): number {
    if (!this.promotion || !this.service.isPromotionActive(this.promotion)) return 0;
    const now = new Date();
    const fin = new Date(this.promotion.dateFin);
    const diff = fin.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getProgression(): number {
    if (!this.promotion) return 0;
    const debut = new Date(this.promotion.dateDebut).getTime();
    const fin = new Date(this.promotion.dateFin).getTime();
    const now = new Date().getTime();
    
    if (now < debut) return 0;
    if (now > fin) return 100;
    
    return ((now - debut) / (fin - debut)) * 100;
  }

  getPrixOriginal(): number {
    return this.promotion?.produitParBoutique?.prix || 0;
  }

  getPrixPromo(): number {
    const prix = this.getPrixOriginal();
    const remise = this.promotion?.remisePourcentage || 0;
    return prix - (prix * remise / 100);
  }

  getEconomie(): number {
    return this.getPrixOriginal() - this.getPrixPromo();
  }

  toggleActif(): void {
    if (!this.promotion) return;
    
    this.service.toggleActif(this.promotion._id).subscribe({
      next: (updated) => {
        if (updated) this.promotion = updated;
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