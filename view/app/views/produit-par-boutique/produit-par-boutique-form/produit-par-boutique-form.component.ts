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
import { ProduitParBoutiqueService } from '../produit-par-boutique.service';
import { BOUTIQUES_MOCK } from '../../boutique/boutique.model';
import { PRODUITS_MOCK } from '../../produit/produit.model';

@Component({
  selector: 'app-produit-par-boutique-form',
  templateUrl: './produit-par-boutique-form.component.html',
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
export class ProduitParBoutiqueFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: string | null = null;
  
  boutiques = BOUTIQUES_MOCK;
  produits = PRODUITS_MOCK;

  constructor(
    private fb: FormBuilder,
    private service: ProduitParBoutiqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      idBoutique: ['', Validators.required],
      idProduit: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      enPromotion: [false],
      prixPromo: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.itemId && this.itemId !== 'nouveau';

    // Écouter les changements de enPromotion
    this.form.get('enPromotion')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('prixPromo')?.enable();
        this.form.get('prixPromo')?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        this.form.get('prixPromo')?.disable();
        this.form.get('prixPromo')?.clearValidators();
        this.form.get('prixPromo')?.setValue('');
      }
      this.form.get('prixPromo')?.updateValueAndValidity();
    });

    if (this.isEditMode && this.itemId) {
      this.loadItem(this.itemId);
    }
  }

  loadItem(id: string): void {
    this.service.getProduitParBoutiqueById(id).subscribe({
      next: (item) => {
        if (item) {
          this.form.patchValue({
            idBoutique: item.idBoutique,
            idProduit: item.idProduit,
            prix: item.prix,
            stock: item.stock,
            enPromotion: item.enPromotion,
            prixPromo: item.prixPromo || ''
          });
        }
      }
    });
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.form.get('idBoutique')?.valid) progress += 20;
    if (this.form.get('idProduit')?.valid) progress += 20;
    if (this.form.get('prix')?.valid) progress += 20;
    if (this.form.get('stock')?.valid) progress += 20;
    if (this.form.get('enPromotion')?.value && this.form.get('prixPromo')?.valid) progress += 20;
    else if (!this.form.get('enPromotion')?.value) progress += 20;
    return progress;
  }

  getProduitLabel(idProduit: string): string {
    const produit = this.produits.find(p => p._id === idProduit);
    return produit ? produit.nom : '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.form.getRawValue(); // Utilise getRawValue pour avoir les champs disabled

    if (this.isEditMode && this.itemId) {
      this.service.updateProduitParBoutique(this.itemId, formData).subscribe({
        next: () => this.router.navigate(['/produits-par-boutique'])
      });
    } else {
      this.service.createProduitParBoutique(formData).subscribe({
        next: () => this.router.navigate(['/produits-par-boutique'])
      });
    }
  }
}