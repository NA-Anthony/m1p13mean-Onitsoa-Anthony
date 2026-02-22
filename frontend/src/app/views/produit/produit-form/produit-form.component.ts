import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';  // ← AJOUTER CET IMPORT
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CardModule,
  FormModule,
  GridModule,
  ButtonModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ProduitService } from '../produit.service';
import { CATEGORIES_PRODUIT } from '../produit.model';

@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,  // ← AJOUTER DANS LES IMPORTS
    RouterModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    ProgressModule,
    IconModule
  ]
})
export class ProduitFormComponent implements OnInit {
  produitForm: FormGroup;
  isEditMode = false;
  produitId: string | null = null;
  categories = CATEGORIES_PRODUIT;
  caracteristiques: { key: string; value: any }[] = [];

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router
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
    this.produitService.getProduitById(id).subscribe({
      next: (produit: any) => {
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
        }
      }
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
    if (this.produitForm.get('image')?.value) progress += 10;
    if (this.caracteristiques.length > 0) progress += 20;
    return progress;
  }

  onSubmit(): void {
    if (this.produitForm.invalid) {
      Object.keys(this.produitForm.controls).forEach(key => {
        this.produitForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.updateCaracteristiques();
    const produitData = this.produitForm.value;

    if (this.isEditMode && this.produitId) {
      this.produitService.updateProduit(this.produitId, produitData).subscribe({
        next: () => this.router.navigate(['/produits'])
      });
    } else {
      this.produitService.createProduit(produitData).subscribe({
        next: () => this.router.navigate(['/produits'])
      });
    }
  }
}