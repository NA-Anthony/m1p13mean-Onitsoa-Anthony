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
import { BoutiqueService } from '../boutique.service';
import { Boutique } from '../boutique.model';

@Component({
  selector: 'app-boutique-list',
  templateUrl: './boutique-list.component.html',
  styleUrls: ['./boutique-list.component.scss'],
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
export class BoutiqueListComponent implements OnInit {
  boutiques: Boutique[] = [];
  filteredBoutiques: Boutique[] = [];
  searchTerm: string = '';
  filterNote: string = '0';
  filterPaiement: string = '';
  
  modesPaiement: string[] = ['Carte bancaire', 'Espèces', 'Mobile Money', 'Paypal', 'Apple Pay'];

  constructor(
    private boutiqueService: BoutiqueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBoutiques();
  }

  loadBoutiques(): void {
    this.boutiqueService.getBoutiques().subscribe({
      next: (data) => {
        this.boutiques = data;
        this.filteredBoutiques = data;
      }
    });
  }

  filterBoutiques(): void {
    this.filteredBoutiques = this.boutiques.filter(boutique => {
      const matchesSearch = this.searchTerm === '' || 
        boutique.nomBoutique.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        boutique.adresse?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        boutique.telephone?.includes(this.searchTerm);
      
      const note = parseFloat(this.filterNote);
      const matchesNote = note === 0 || (boutique.noteMoyenne || 0) >= note;
      
      const matchesPaiement = this.filterPaiement === '' || 
        (boutique.modePaiementAcceptes || []).includes(this.filterPaiement);
      
      return matchesSearch && matchesNote && matchesPaiement;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/boutiques', id]);
  }

  deleteBoutique(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette boutique ?')) {
      this.boutiqueService.deleteBoutique(id).subscribe({
        next: () => this.loadBoutiques()
      });
    }
  }

  getNoteMoyenne(): string {
    if (this.boutiques.length === 0) return '0';
    const sum = this.boutiques.reduce((acc, b) => acc + (b.noteMoyenne || 0), 0);
    return (sum / this.boutiques.length).toFixed(1);
  }

  getTotalAvis(): number {
    return this.boutiques.reduce((acc, b) => acc + (b.totalAvis || 0), 0);
  }

  getPaiementsUniques(): number {
    const paiements = new Set(this.boutiques.flatMap(b => b.modePaiementAcceptes || []));
    return paiements.size;
  }

  getHorairesOuverts(boutique: Boutique): number {
    if (!boutique.horaires) return 0;
    return Object.values(boutique.horaires).filter(h => h?.ouverture && h?.fermeture).length;
  }

  getNoteColor(note?: number): string {
    const n = note || 0;
    if (n >= 4) return 'success';
    if (n >= 3) return 'warning';
    return 'danger';
  }
}