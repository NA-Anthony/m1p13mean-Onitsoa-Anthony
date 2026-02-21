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
import { BoutiqueService } from '../boutique.service';
import { Boutique } from '../boutique.model';

@Component({
  selector: 'app-boutique-detail',
  templateUrl: './boutique-detail.component.html',
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
export class BoutiqueDetailComponent implements OnInit {
  boutique: Boutique | null = null;
  joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  constructor(
    private route: ActivatedRoute,
    private boutiqueService: BoutiqueService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.boutiqueService.getBoutiqueById(id).subscribe({
        next: (data) => this.boutique = data || null
      });
    }
  }

  getHoraire(jour: string, type: 'ouverture' | 'fermeture'): string {
    if (!this.boutique || !this.boutique.horaires || !this.boutique.horaires[jour]) {
      return 'Fermé';
    }
    return this.boutique.horaires[jour][type] || 'Fermé';
  }

  getPaymentIcon(mode: string): string {
    const icons: {[key: string]: string} = {
      'Carte bancaire': 'cil-credit-card',
      'Espèces': 'cil-money',
      'Mobile Money': 'cil-phone',
      'Paypal': 'cib-paypal',
      'Apple Pay': 'cib-apple-pay'
    };
    return icons[mode] || 'cil-credit-card';
  }

  getNoteColor(): string {
    if (!this.boutique) return 'secondary';
    const note = this.boutique.noteMoyenne;
    if (note >= 4) return 'success';
    if (note >= 3) return 'warning';
    return 'danger';
  }
}