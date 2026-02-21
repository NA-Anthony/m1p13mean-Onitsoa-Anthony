import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  ButtonModule,
  BadgeModule,
  TableModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { TarifLivraisonService } from '../tarif-livraison.service';
import { TarifLivraison } from '../tarif-livraison.model';

@Component({
  selector: 'app-tarif-livraison-list',
  templateUrl: './tarif-livraison-list.component.html',
  styleUrls: ['./tarif-livraison-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    GridModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    IconModule
  ]
})
export class TarifLivraisonListComponent implements OnInit {
  tarifs: TarifLivraison[] = [];
  filteredTarifs: TarifLivraison[] = [];
  searchTerm: string = '';

  constructor(
    private service: TarifLivraisonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTarifs();
  }

  loadTarifs(): void {
    this.service.getTarifs().subscribe({
      next: (data) => {
        this.tarifs = data;
        this.filteredTarifs = data;
      }
    });
  }

  filterTarifs(): void {
    this.filteredTarifs = this.tarifs.filter(t => {
      return this.searchTerm === '' || 
        t.boutique?.nomBoutique.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t._id.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/tarifs-livraison', id]);
  }

  deleteTarif(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ces tarifs ?')) {
      this.service.deleteTarif(id).subscribe({
        next: () => this.loadTarifs()
      });
    }
  }

  getTotalTarifs(): number {
    return this.tarifs.length;
  }

  getNombreTranchesTotal(): number {
    return this.tarifs.reduce((acc, t) => acc + t.tarifs.length, 0);
  }

  getPrixMoyen(): number {
    if (this.tarifs.length === 0) return 0;
    const somme = this.tarifs.reduce((acc, t) => {
      const sommeTranches = t.tarifs.reduce((s, tr) => s + tr.prix, 0);
      return acc + (t.tarifs.length > 0 ? sommeTranches / t.tarifs.length : 0);
    }, 0);
    return somme / this.tarifs.length;
  }

  getZoneGratuiteMoyenne(): number {
    if (this.tarifs.length === 0) return 0;
    const somme = this.tarifs.reduce((acc, t) => acc + t.zoneGratuite, 0);
    return somme / this.tarifs.length;
  }

  formatDistance(distance: number): string {
    return distance === 0 ? '0 km' : `${distance} km`;
  }
}