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
import { AvisService } from '../avis.service';
import { Avis, NOTES } from '../avis.model';

@Component({
  selector: 'app-avis-list',
  templateUrl: './avis-list.component.html',
  styleUrls: ['./avis-list.component.scss'],
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
export class AvisListComponent implements OnInit {
  avis: Avis[] = [];
  filteredAvis: Avis[] = [];
  searchTerm: string = '';
  filterNote: string = '';
  filterReponse: string = 'tous';
  
  notes = NOTES;

  constructor(
    private service: AvisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAvis();
  }

  loadAvis(): void {
    this.service.getAvis().subscribe({
      next: (data) => {
        this.avis = data;
        this.filteredAvis = data;
      }
    });
  }

  filterAvis(): void {
    this.filteredAvis = this.avis.filter(a => {
      const matchesSearch = this.searchTerm === '' || 
        a.commentaire?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.produitParBoutique?.produit?.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.acheteur?.telephone?.includes(this.searchTerm);
      
      const matchesNote = this.filterNote === '' || a.note === parseInt(this.filterNote);
      
      const matchesReponse = this.filterReponse === 'tous' ||
        (this.filterReponse === 'avec' && a.reponseBoutique) ||
        (this.filterReponse === 'sans' && !a.reponseBoutique);
      
      return matchesSearch && matchesNote && matchesReponse;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/avis', id]);
  }

  deleteAvis(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.service.deleteAvis(id).subscribe({
        next: () => this.loadAvis()
      });
    }
  }

  getTotalAvis(): number {
    return this.avis.length;
  }

  getNoteMoyenneGlobale(): number {
    if (this.avis.length === 0) return 0;
    const sum = this.avis.reduce((acc, a) => acc + a.note, 0);
    return sum / this.avis.length;
  }

  getPourcentageNote(note: number): number {
    const count = this.avis.filter(a => a.note === note).length;
    if (this.avis.length === 0) return 0;
    return (count / this.avis.length) * 100;
  }

  getTauxReponse(): number {
    const avecReponse = this.avis.filter(a => a.reponseBoutique).length;
    if (this.avis.length === 0) return 0;
    return (avecReponse / this.avis.length) * 100;
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}