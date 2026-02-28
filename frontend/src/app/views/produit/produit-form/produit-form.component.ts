import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  CardModule,
  FormModule,
  GridModule,
  ButtonModule,
  ProgressModule,
  AlertModule,
  SpinnerModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ProduitService } from '../produit.service';
import { CATEGORIES_PRODUIT } from '../produit.model';

@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    ProgressModule,
    AlertModule,
    SpinnerModule,
    IconModule
  ]
})
export class ProduitFormComponent implements OnInit {
  produitForm: FormGroup;
  isEditMode = false;
  produitId: string | null = null;
  categories = CATEGORIES_PRODUIT;
  caracteristiques: { key: string; value: any }[] = [];
  
  // États de chargement
  loading = false;
  uploadLoading = false;
  uploadProgress = 0;
  error: string | null = null;
  successMessage: string | null = null;
  
  // Pour l'upload d'image
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.produitForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      categorie: ['autre', Validators.required],
      image: [''],
      datePeremption: [''],
      caracteristiques: [{}]
    });
  }

  ngOnInit(): void {
    this.produitId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.produitId && this.produitId !== 'nouveau';

    if (this.isEditMode && this.produitId) {
      this.loadProduit(this.produitId);
    }
  }

  loadProduit(id: string): void {
    this.loading = true;
    this.produitService.getProduitById(id).subscribe({
      next: (response: any) => {
        const produit = response?.produit || response;
        if (produit) {
          this.produitForm.patchValue({
            nom: produit.nom,
            description: produit.description,
            categorie: produit.categorie,
            image: produit.image,
            datePeremption: produit.datePeremption ? 
              new Date(produit.datePeremption).toISOString().split('T')[0] : '',
            caracteristiques: produit.caracteristiques || {}
          });
          
          if (produit.caracteristiques) {
            this.caracteristiques = Object.keys(produit.caracteristiques).map(key => ({
              key,
              value: produit.caracteristiques[key]
            }));
          }

          // Prévisualisation de l'image existante
          if (produit.image) {
            this.imagePreview = produit.image;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.msg || 'Erreur lors du chargement du produit';
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

  // Méthode removeImage ajoutée
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.produitForm.patchValue({ image: '' });
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(this.produitForm.get('image')?.value || '');
        return;
      }

      this.uploadLoading = true;
      this.uploadProgress = 0;
      
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
          this.error = 'Erreur lors de l\'upload de l\'image';
          reject(err);
        }
      });
    });
  }

  addCaracteristique(): void {
    this.caracteristiques.push({ key: '', value: '' });
  }

  removeCaracteristique(index: number): void {
    this.caracteristiques.splice(index, 1);
    this.updateCaracteristiques();
  }

  updateCaracteristiques(): void {
    const caracObj: any = {};
    this.caracteristiques.forEach(c => {
      if (c.key.trim()) {
        caracObj[c.key] = c.value;
      }
    });
    this.produitForm.patchValue({ caracteristiques: caracObj });
  }

  trackByIndex(index: number): number {
    return index;
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.produitForm.get('nom')?.valid) progress += 30;
    if (this.produitForm.get('description')?.value) progress += 20;
    if (this.produitForm.get('categorie')?.valid) progress += 20;
    if (this.produitForm.get('image')?.value || this.imagePreview) progress += 10;
    if (this.caracteristiques.length > 0) progress += 20;
    return progress;
  }

  async onSubmit(): Promise<void> {
    if (this.produitForm.invalid) {
      Object.keys(this.produitForm.controls).forEach(key => {
        this.produitForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;
    this.updateCaracteristiques();

    try {
      const imageUrl = await this.uploadImage();
      
      const produitData = {
        ...this.produitForm.value,
        image: imageUrl || this.produitForm.get('image')?.value
      };

      if (this.isEditMode && this.produitId) {
        this.produitService.updateProduit(this.produitId, produitData).subscribe({
          next: () => {
            this.successMessage = 'Produit mis à jour avec succès';
            setTimeout(() => {
              this.router.navigate(['/produits']);
            }, 1500);
          },
          error: (err) => {
            this.error = err.error?.msg || 'Erreur lors de la mise à jour';
            this.loading = false;
            console.error(err);
          }
        });
      } else {
        this.produitService.createProduit(produitData).subscribe({
          next: () => {
            this.successMessage = 'Produit créé avec succès';
            setTimeout(() => {
              this.router.navigate(['/produits']);
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
}