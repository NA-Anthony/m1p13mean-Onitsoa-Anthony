import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CardModule,
  FormModule,
  GridModule,
  ButtonModule,
  ProgressModule,
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { BoutiqueService } from '../boutique.service';

@Component({
  selector: 'app-boutique-form',
  templateUrl: './boutique-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    ProgressModule,
    BadgeModule,
    IconModule
  ]
})
export class BoutiqueFormComponent implements OnInit {
  boutiqueForm: FormGroup;
  isEditMode = false;
  boutiqueId: string | null = null;

  joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  modesPaiement = ['Carte bancaire', 'Espèces', 'Mobile Money', 'Paypal', 'Apple Pay'];
  selectedPaiements: string[] = [];

  constructor(
    private fb: FormBuilder,
    private boutiqueService: BoutiqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.boutiqueForm = this.fb.group({
      nomBoutique: ['', Validators.required],
      description: [''],
      adresse: [''],
      telephone: [''],
      logo: [''],
      modePaiementAcceptes: [[]],
      horaires: this.fb.group({
        lundi: this.fb.group({ ouverture: [''], fermeture: [''] }),
        mardi: this.fb.group({ ouverture: [''], fermeture: [''] }),
        mercredi: this.fb.group({ ouverture: [''], fermeture: [''] }),
        jeudi: this.fb.group({ ouverture: [''], fermeture: [''] }),
        vendredi: this.fb.group({ ouverture: [''], fermeture: [''] }),
        samedi: this.fb.group({ ouverture: [''], fermeture: [''] }),
        dimanche: this.fb.group({ ouverture: [''], fermeture: [''] })
      })
    });
  }

  ngOnInit(): void {
    this.boutiqueId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.boutiqueId && this.boutiqueId !== 'nouvelle';

    if (this.isEditMode && this.boutiqueId) {
      this.loadBoutique(this.boutiqueId);
    }
  }

  loadBoutique(id: string): void {
    this.boutiqueService.getBoutiqueById(id).subscribe({
      next: (res) => {
        const boutique = res?.boutique || res;
        if (boutique) {
          this.boutiqueForm.patchValue({
            nomBoutique: boutique.nomBoutique,
            description: boutique.description,
            adresse: boutique.adresse,
            telephone: boutique.telephone,
            logo: boutique.logo,
            modePaiementAcceptes: boutique.modePaiementAcceptes,
            horaires: boutique.horaires
          });
          this.selectedPaiements = boutique.modePaiementAcceptes || [];
        }
      }
    });
  }

  onPaiementChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedPaiements.push(value);
    } else {
      this.selectedPaiements = this.selectedPaiements.filter(p => p !== value);
    }
    this.boutiqueForm.patchValue({ modePaiementAcceptes: this.selectedPaiements });
  }

  getProgressValue(): number {
    let progress = 0;
    
    if (this.boutiqueForm.get('nomBoutique')?.valid) progress += 20;
    if (this.boutiqueForm.get('description')?.value) progress += 10;
    if (this.boutiqueForm.get('adresse')?.value) progress += 5;
    if (this.boutiqueForm.get('telephone')?.value) progress += 5;
    
    if (this.selectedPaiements.length > 0) progress += 20;
    
    const horaires = this.boutiqueForm.get('horaires')?.value || {};
    const joursOuverts = Object.values(horaires).filter((h: any) => h?.ouverture && h?.fermeture).length;
    progress += (joursOuverts / 7) * 40;
    
    return Math.min(progress, 100);
  }

  getHoraireStatus(jour: string): boolean {
    const horaire = this.boutiqueForm.get(['horaires', jour])?.value;
    return horaire?.ouverture && horaire?.fermeture;
  }

  checkHoraire(jour: string): void {
    const horaire = this.boutiqueForm.get(['horaires', jour]);
    if (horaire?.get('ouverture')?.value && !horaire?.get('fermeture')?.value) {
      horaire.get('fermeture')?.setValue('19:00');
    }
    if (!horaire?.get('ouverture')?.value && horaire?.get('fermeture')?.value) {
      horaire.get('ouverture')?.setValue('09:00');
    }
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

  onSubmit(): void {
    if (this.boutiqueForm.invalid) {
      Object.keys(this.boutiqueForm.controls).forEach(key => {
        this.boutiqueForm.get(key)?.markAsTouched();
      });
      return;
    }

    const boutiqueData = this.boutiqueForm.value;

    if (this.isEditMode && this.boutiqueId) {
      this.boutiqueService.updateBoutique(this.boutiqueId, boutiqueData).subscribe({
        next: () => this.router.navigate(['/boutiques'])
      });
    } else {
      this.boutiqueService.createBoutique(boutiqueData).subscribe({
        next: () => this.router.navigate(['/boutiques'])
      });
    }
  }
}