import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss'],
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
    ProgressModule,
    IconModule
  ]
})
export class PromotionListComponent implements OnInit {
  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  searchTerm: string = '';
  filterStatut: string = 'toutes';

  constructor(
    private service: PromotionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.service.getPromotions().subscribe({
      next: (data) => {
        this.promotions = data;
        this.filteredPromotions = data;
      }
    });
  }

  filterPromotions(): void {
    this.filteredPromotions = this.promotions.filter(promo => {
      const matchesSearch = this.searchTerm === '' || 
        promo.produitParBoutique?.produit?.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        promo.produitParBoutique?.boutique?.nomBoutique.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const isActive = this.service.isPromotionActive(promo);
      const matchesStatut = this.filterStatut === 'toutes' ||
        (this.filterStatut === 'actives' && isActive) ||
        (this.filterStatut === 'inactives' && !isActive);
      
      return matchesSearch && matchesStatut;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/promotions', id]);
  }

  deletePromotion(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      this.service.deletePromotion(id).subscribe({
        next: () => this.loadPromotions()
      });
    }
  }

  toggleActif(id: string, event: Event): void {
    event.stopPropagation();
    this.service.toggleActif(id).subscribe({
      next: () => this.loadPromotions()
    });
  }

  getTotalPromotions(): number {
    return this.promotions.length;
  }

  getTotalActives(): number {
    return this.promotions.filter(p => this.service.isPromotionActive(p)).length;
  }

  getTotalInactives(): number {
    return this.promotions.filter(p => !this.service.isPromotionActive(p)).length;
  }

  getStatut(promotion: Promotion): { class: string, label: string } {
    const isActive = this.service.isPromotionActive(promotion);
    if (!promotion.actif) return { class: 'secondary', label: 'Désactivée' };
    if (isActive) return { class: 'success', label: 'Active' };
    return { class: 'warning', label: 'Expirée' };
  }

  getRemainingDays(promotion: Promotion): number {
    if (!this.service.isPromotionActive(promotion)) return 0;
    const now = new Date();
    const fin = new Date(promotion.dateFin);
    const diff = fin.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getPrixOriginal(): number {
    // À implémenter avec le prix du produit
    return 0;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
  getRemiseMoyenne(): number {
    if (this.promotions.length === 0) return 0;
    const sum = this.promotions.reduce((acc, p) => acc + p.remisePourcentage, 0);
    return Math.round(sum / this.promotions.length);
  }
}