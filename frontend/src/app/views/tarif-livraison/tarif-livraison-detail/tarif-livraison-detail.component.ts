import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  ButtonModule,
  BadgeModule,
  TableModule,
  ProgressModule  // ← AJOUTER CET IMPORT
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { TarifLivraisonService } from '../tarif-livraison.service';
import { TarifLivraison } from '../tarif-livraison.model';

@Component({
  selector: 'app-tarif-livraison-detail',
  templateUrl: './tarif-livraison-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    ProgressModule,  // ← AJOUTER DANS LES IMPORTS
    IconModule
  ]
})
export class TarifLivraisonDetailComponent implements OnInit {
  tarif: TarifLivraison | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: TarifLivraisonService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getTarifById(id).subscribe({
        next: (data) => this.tarif = data || null
      });
    }
  }

  getPrixMin(): number {
    if (!this.tarif || !this.tarif.tarifs || this.tarif.tarifs.length === 0) return 0;
    return Math.min(...this.tarif.tarifs.map(t => t.prix));
  }

  getPrixMax(): number {
    if (!this.tarif || !this.tarif.tarifs || this.tarif.tarifs.length === 0) return 0;
    return Math.max(...this.tarif.tarifs.map(t => t.prix));
  }

  getDistanceMax(): number {
    if (!this.tarif || !this.tarif.tarifs || this.tarif.tarifs.length === 0) return 0;
    return Math.max(...this.tarif.tarifs.map(t => t.distanceMax));
  }

  getPrixParDistance(distance: number): number | null {
    if (!this.tarif) return null;
    return this.service.calculerPrixLivraison(this.tarif.idBoutique, distance);
  }

  getExemplesDistances(): { distance: number, prix: number | null }[] {
    if (!this.tarif) return [];
    
    const distances = [2, 5, 10, 15, 25, 40];
    return distances.map(d => ({
      distance: d,
      prix: this.getPrixParDistance(d)
    })).filter(ex => ex.prix !== null);
  }

  getNombreTranches(): number {
    return this.tarif?.tarifs?.length || 0;
  }

  aUneZoneGratuite(): boolean {
    return this.tarif?.zoneGratuite ? this.tarif.zoneGratuite > 0 : false;
  }

  formatDate(date?: Date): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}