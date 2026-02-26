import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  SpinnerModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { BoutiqueService } from '../../boutique/boutique.service';
import { CartService } from '../cart.service';
import { Boutique } from '../../boutique/boutique.model';

@Component({
  selector: 'app-boutiques-catalogue',
  templateUrl: './boutiques-catalogue.component.html',
  styleUrls: ['./boutiques-catalogue.component.scss'],
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
    IconModule
  ]
})
export class BoutiquesCatalogueComponent implements OnInit {
  boutiques: Boutique[] = [];
  filteredBoutiques: Boutique[] = [];
  searchTerm: string = '';
  loading = true;
  error = '';

  constructor(
    private boutiqueService: BoutiqueService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadBoutiques();
  }

  loadBoutiques(): void {
    this.loading = true;
    this.boutiqueService.getBoutiques().subscribe({
      next: (data: any) => {
        // L'API peut retourner tableau direct ou { boutiques: [...] }
        this.boutiques = Array.isArray(data) ? data : (data.boutiques || []);
        this.filteredBoutiques = [...this.boutiques];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement boutiques', err);
        this.error = 'Impossible de charger les boutiques.';
        this.loading = false;
      }
    });
  }

  filterBoutiques(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredBoutiques = this.boutiques.filter(b =>
      !term ||
      b.nomBoutique.toLowerCase().includes(term) ||
      (b.description || '').toLowerCase().includes(term) ||
      (b.adresse || '').toLowerCase().includes(term)
    );
  }

  getStarArray(note: number | undefined): number[] {
    const n = Math.round(note || 0);
    return Array.from({ length: 5 }, (_, i) => i < n ? 1 : 0);
  }

  getInitiales(nom: string): string {
    return nom
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '')
      .join('');
  }
}
