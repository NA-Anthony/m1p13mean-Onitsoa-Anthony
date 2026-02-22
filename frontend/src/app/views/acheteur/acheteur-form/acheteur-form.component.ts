import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CardModule,
  FormModule,
  GridModule,
  ButtonModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AcheteurService } from '../acheteur.service';
import { PREFERENCES_DISPONIBLES } from '../acheteur.model';

@Component({
  selector: 'app-acheteur-form',
  templateUrl: './acheteur-form.component.html',
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
    IconModule
  ]
})
export class AcheteurFormComponent implements OnInit {
  acheteurForm: FormGroup;
  isEditMode = false;
  acheteurId: string | null = null;

  preferencesDisponibles = PREFERENCES_DISPONIBLES;
  selectedPreferences: string[] = [];

  constructor(
    private fb: FormBuilder,
    private acheteurService: AcheteurService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.acheteurForm = this.fb.group({
      telephone: ['', [Validators.pattern('^[0-9\\s+]{10,}$')]],
      adresseLivraisonParDefaut: this.fb.group({
        rue: ['', Validators.required],
        ville: ['', Validators.required],
        codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        pays: ['France', Validators.required]
      }),
      preferences: [[]]
    });
  }

  ngOnInit(): void {
    this.acheteurId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.acheteurId && this.acheteurId !== 'nouveau';

    if (this.isEditMode && this.acheteurId) {
      this.loadAcheteur(this.acheteurId);
    }
  }

  loadAcheteur(id: string): void {
    this.acheteurService.getAcheteurById(id).subscribe({
      next: (acheteur) => {
        if (acheteur) {
          this.acheteurForm.patchValue({
            telephone: acheteur.telephone,
            adresseLivraisonParDefaut: acheteur.adresseLivraisonParDefaut,
            preferences: acheteur.preferences
          });
          this.selectedPreferences = acheteur.preferences || [];
        }
      }
    });
  }

  onPreferenceChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedPreferences.push(value);
    } else {
      this.selectedPreferences = this.selectedPreferences.filter(p => p !== value);
    }
    this.acheteurForm.patchValue({ preferences: this.selectedPreferences });
  }

  isPreferenceSelected(pref: string): boolean {
    return this.selectedPreferences.includes(pref);
  }

  getProgressValue(): number {
    let progress = 0;
    
    if (this.acheteurForm.get('telephone')?.value) progress += 20;
    
    const adresse = this.acheteurForm.get('adresseLivraisonParDefaut')?.value;
    if (adresse?.rue) progress += 20;
    if (adresse?.ville) progress += 20;
    if (adresse?.codePostal?.length === 5) progress += 20;
    
    if (this.selectedPreferences.length > 0) progress += 20;
    
    return progress;
  }

  getCodePostalErrors(): string {
    const control = this.acheteurForm.get('adresseLivraisonParDefaut.codePostal');
    if (control?.hasError('required')) return 'Le code postal est requis';
    if (control?.hasError('pattern')) return 'Le code postal doit contenir 5 chiffres';
    return '';
  }

  getTelephoneErrors(): string {
    const control = this.acheteurForm.get('telephone');
    if (control?.hasError('pattern')) return 'Format de téléphone invalide';
    return '';
  }

  onSubmit(): void {
    if (this.acheteurForm.invalid) {
      Object.keys(this.acheteurForm.controls).forEach(key => {
        this.acheteurForm.get(key)?.markAsTouched();
      });
      return;
    }

    const acheteurData = this.acheteurForm.value;

    if (this.isEditMode && this.acheteurId) {
      this.acheteurService.updateAcheteur(this.acheteurId, acheteurData).subscribe({
        next: () => this.router.navigate(['/acheteurs'])
      });
    } else {
      this.acheteurService.createAcheteur(acheteurData).subscribe({
        next: () => this.router.navigate(['/acheteurs'])
      });
    }
  }
}