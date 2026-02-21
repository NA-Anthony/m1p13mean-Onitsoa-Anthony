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
import { PromotionService } from '../promotion.service';
import { ProduitParBoutiqueService } from '../../produit-par-boutique/produit-par-boutique.service';

@Component({
  selector: 'app-promotion-form',
  templateUrl: './promotion-form.component.html',
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
export class PromotionFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  promotionId: string | null = null;
  
  produitsParBoutique: any[] = [];
  prixOriginal: number = 0;
  prixPromo: number = 0;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private service: PromotionService,
    private produitService: ProduitParBoutiqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      idProduitParBoutique: ['', Validators.required],
      remisePourcentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      actif: [true]
    });
  }

  ngOnInit(): void {
    this.promotionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.promotionId && this.promotionId !== 'nouveau';

    // Charger la liste des produits par boutique
    this.produitService.getProduitsParBoutique().subscribe({
      next: (data) => {
        this.produitsParBoutique = data;
      }
    });

    // Surveiller les changements de produit et de remise
    this.form.get('idProduitParBoutique')?.valueChanges.subscribe(id => {
      this.calculerPrixPromo();
    });

    this.form.get('remisePourcentage')?.valueChanges.subscribe(() => {
      this.calculerPrixPromo();
    });

    // Validation que dateFin > dateDebut
    this.form.get('dateFin')?.valueChanges.subscribe(() => {
      const dateDebut = this.form.get('dateDebut')?.value;
      const dateFin = this.form.get('dateFin')?.value;
      
      if (dateDebut && dateFin && new Date(dateFin) <= new Date(dateDebut)) {
        this.form.get('dateFin')?.setErrors({ dateInvalide: true });
      }
    });

    if (this.isEditMode && this.promotionId) {
      this.loadPromotion(this.promotionId);
    }
  }

  loadPromotion(id: string): void {
    this.service.getPromotionById(id).subscribe({
      next: (promotion) => {
        if (promotion) {
          this.form.patchValue({
            idProduitParBoutique: promotion.idProduitParBoutique,
            remisePourcentage: promotion.remisePourcentage,
            dateDebut: new Date(promotion.dateDebut).toISOString().split('T')[0],
            dateFin: new Date(promotion.dateFin).toISOString().split('T')[0],
            actif: promotion.actif
          });
          this.calculerPrixPromo();
        }
      }
    });
  }

  calculerPrixPromo(): void {
    const produitId = this.form.get('idProduitParBoutique')?.value;
    const remise = this.form.get('remisePourcentage')?.value;
    
    const produit = this.produitsParBoutique.find(p => p._id === produitId);
    if (produit && remise) {
      this.prixOriginal = produit.prix;
      this.prixPromo = produit.prix - (produit.prix * remise / 100);
    } else {
      this.prixOriginal = 0;
      this.prixPromo = 0;
    }
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.form.get('idProduitParBoutique')?.valid) progress += 25;
    if (this.form.get('remisePourcentage')?.valid) progress += 25;
    if (this.form.get('dateDebut')?.valid) progress += 25;
    if (this.form.get('dateFin')?.valid) progress += 25;
    return progress;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.form.value;

    if (this.isEditMode && this.promotionId) {
      this.service.updatePromotion(this.promotionId, formData).subscribe({
        next: () => this.router.navigate(['/promotions'])
      });
    } else {
      this.service.createPromotion(formData).subscribe({
        next: () => this.router.navigate(['/promotions'])
      });
    }
  }
}