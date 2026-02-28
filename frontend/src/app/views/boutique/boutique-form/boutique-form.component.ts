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
  BadgeModule,
  AlertModule,
  SpinnerModule,
  AvatarModule  // ← AJOUTER CET IMPORT
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { BoutiqueService } from '../boutique.service';
import { HttpClient } from '@angular/common/http';

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
    AlertModule,
    SpinnerModule,
    AvatarModule,  // ← AJOUTER DANS LES IMPORTS
    IconModule
  ]
})
export class BoutiqueFormComponent implements OnInit {
  boutiqueForm: FormGroup;
  isEditMode = false;
  boutiqueId: string | null = null;
  loading = false;
  uploadLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  modesPaiement = ['Carte bancaire', 'Espèces', 'Mobile Money', 'Paypal', 'Apple Pay'];
  selectedPaiements: string[] = [];
  
  // Pour l'upload d'image
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private boutiqueService: BoutiqueService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
    this.loading = true;
    this.boutiqueService.getBoutiqueById(id).subscribe({
      next: (response) => {
        const boutique = response.boutique;
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
          
          if (boutique.logo) {
            this.imagePreview = boutique.logo;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la boutique';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.error = 'Veuillez sélectionner une image valide';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'L\'image ne doit pas dépasser 5MB';
        return;
      }

      this.selectedFile = file;
      this.error = null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // AJOUTER cette méthode pour le drag & drop
  onDropFile(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        this.error = 'Veuillez sélectionner une image valide';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'L\'image ne doit pas dépasser 5MB';
        return;
      }

      this.selectedFile = file;
      this.error = null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // AJOUTER cette méthode pour déclencher l'input file
  triggerFileInput(): void {
    document.getElementById('file-upload')?.click();
  }

  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(this.boutiqueForm.get('logo')?.value || '');
        return;
      }
  
      this.uploadLoading = true;
      this.uploadProgress = 0;
      this.error = null;
      
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      
      this.http.post('https://m1p13mean-onitsoa-anthony.onrender.com/api/upload', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event: any) => {
          if (event.type === 1) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === 4) {
            this.uploadLoading = false;
            resolve(event.body.imageUrl || event.body.url || '');
          }
        },
        error: (err) => {
          this.uploadLoading = false;
          console.error('Upload error:', err);
          this.error = err.error?.msg || 'Erreur lors de l\'upload de l\'image';
          reject(err);
        }
      });
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

  async onSubmit(): Promise<void> {
    if (this.boutiqueForm.invalid) {
      Object.keys(this.boutiqueForm.controls).forEach(key => {
        this.boutiqueForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const imageUrl = await this.uploadImage();
      
      const boutiqueData = {
        ...this.boutiqueForm.value,
        logo: imageUrl || this.boutiqueForm.get('logo')?.value
      };

      if (this.isEditMode && this.boutiqueId) {
        this.boutiqueService.updateBoutique(this.boutiqueId, boutiqueData).subscribe({
          next: () => {
            this.successMessage = 'Boutique mise à jour avec succès';
            setTimeout(() => {
              this.router.navigate(['/boutiques']);
            }, 1500);
          },
          error: (err) => {
            this.error = err.error?.msg || 'Erreur lors de la mise à jour';
            this.loading = false;
            console.error(err);
          }
        });
      } else {
        this.boutiqueService.createBoutique(boutiqueData).subscribe({
          next: () => {
            this.successMessage = 'Boutique créée avec succès';
            setTimeout(() => {
              this.router.navigate(['/boutiques']);
            }, 1500);
          },
          error: (err) => {
            this.error = err.error?.msg || 'Erreur lors de la création';
            this.loading = false;
            console.error(err);
          }
        });
      }
    } catch (error) {
      this.error = 'Erreur lors de l\'upload de l\'image';
      this.loading = false;
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.boutiqueForm.patchValue({ logo: '' });
    // Reset de l'input file
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}