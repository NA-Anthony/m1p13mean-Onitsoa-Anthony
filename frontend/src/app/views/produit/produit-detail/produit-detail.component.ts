import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ProduitService } from '../produit.service';
import { CATEGORIES_PRODUIT } from '../produit.model';

@Component({
  selector: 'app-produit-detail',
  templateUrl: './produit-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    IconModule
  ]
})
export class ProduitDetailComponent implements OnInit {
  produit: any = null;  // ← Changé en any pour éviter les erreurs de typage

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produitService.getProduitById(id).subscribe({
        next: (data) => this.produit = data || null
      });
    }
  }

  getCategorieLabel(): string {
    if (!this.produit) return '';
    const cat = CATEGORIES_PRODUIT.find(c => c.value === this.produit?.categorie);
    return cat ? cat.label : this.produit.categorie;
  }

  getCategorieColor(): string {
    if (!this.produit) return 'secondary';
    switch(this.produit.categorie) {
      case 'alimentaire': return 'success';
      case 'habillement': return 'info';
      case 'electronique': return 'warning';
      case 'maison': return 'primary';
      default: return 'secondary';
    }
  }

  getCategorieIcon(): string {
    if (!this.produit) return 'cil-star';
    const cat = CATEGORIES_PRODUIT.find(c => c.value === this.produit?.categorie);
    return cat ? cat.icon : 'cil-star';
  }

  formatDate(date?: Date): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  isPerime(): boolean {
    if (!this.produit?.datePeremption) return false;
    return new Date(this.produit.datePeremption) < new Date();
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}