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
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.boutiqueService.getBoutiqueById(id).subscribe({
        next: (res) => {
          this.boutique = res?.boutique || res || null;
        }
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
    const icons: { [key: string]: string } = {
      'Carte bancaire': 'cil-credit-card',
      'Espèces': 'cil-money',
      'Mobile Money': 'cil-phone',
      'Paypal': 'cibCcPaypal',
      'Apple Pay': 'cibCcApplePay'
    };
    return icons[mode] || 'cil-credit-card';
  }

  getNoteColor(): string {
    if (!this.boutique) return 'secondary';
    const note = this.boutique.noteMoyenne || 0;
    if (note >= 4) return 'success';
    if (note >= 3) return 'warning';
    return 'danger';
  }

  getFullImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')) {
      return url;
    }
    return 'https://m1p13mean-onitsoa-anthony.onrender.com' + (url.startsWith('/') ? '' : '/') + url;
  }

  getInitiales(nom: string): string {
    if (!nom) return 'B';
    return nom
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '')
      .join('');
  }

  getBoutiqueImage(boutique: any): string {
    if (!boutique) return '';
    const logo = boutique.logo || boutique.profil?.logo || boutique.user?.photo || boutique.photo;
    return this.getFullImageUrl(logo);
  }
}