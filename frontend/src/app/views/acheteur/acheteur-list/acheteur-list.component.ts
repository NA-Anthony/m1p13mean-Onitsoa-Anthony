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
import { AcheteurService } from '../acheteur.service';
import { Acheteur } from '../acheteur.model';

@Component({
  selector: 'app-acheteur-list',
  templateUrl: './acheteur-list.component.html',
  styleUrls: ['./acheteur-list.component.scss'],
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
export class AcheteurListComponent implements OnInit {
  acheteurs: Acheteur[] = [];
  filteredAcheteurs: Acheteur[] = [];
  searchTerm: string = '';
  filterVille: string = '';

  constructor(
    private acheteurService: AcheteurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAcheteurs();
  }

  loadAcheteurs(): void {
    this.acheteurService.getAcheteurs().subscribe({
      next: (data) => {
        this.acheteurs = data;
        this.filteredAcheteurs = data;
      }
    });
  }

  filterAcheteurs(): void {
    this.filteredAcheteurs = this.acheteurs.filter(acheteur => {
      const matchesSearch = this.searchTerm === '' || 
        acheteur.telephone?.includes(this.searchTerm) ||
        acheteur.adresseLivraisonParDefaut.ville.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        acheteur.adresseLivraisonParDefaut.rue.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesVille = this.filterVille === '' || 
        acheteur.adresseLivraisonParDefaut.ville === this.filterVille;
      
      return matchesSearch && matchesVille;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/acheteurs', id]);
  }

  getVillesUniques(): string[] {
    const villes = this.acheteurs.map(a => a.adresseLivraisonParDefaut.ville);
    return [...new Set(villes)];
  }

  getTotalPreferences(): number {
    return this.acheteurs.reduce((acc, a) => acc + a.preferences.length, 0);
  }

  getTauxRemplissage(): number {
    if (this.acheteurs.length === 0) return 0;
    const complets = this.acheteurs.filter(a => a.telephone && a.adresseLivraisonParDefaut.rue).length;
    return Math.round((complets / this.acheteurs.length) * 100);
  }

  deleteAcheteur(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet acheteur ?')) {
      this.acheteurService.deleteAcheteur(id).subscribe({
        next: () => this.loadAcheteurs()
      });
    }
  }

  getInitials(id: string): string {
    return `A${id}`;
  }

  getRandomColor(id: string): string {
    const colors = ['primary', 'success', 'info', 'warning', 'danger'];
    const index = parseInt(id) % colors.length;
    return colors[index];
  }
}