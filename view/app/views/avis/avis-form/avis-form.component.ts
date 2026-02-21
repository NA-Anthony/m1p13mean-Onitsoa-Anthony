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
import { AvisService } from '../avis.service';
import { ProduitParBoutiqueService } from '../../produit-par-boutique/produit-par-boutique.service';
import { AcheteurService } from '../../acheteur/acheteur.service';
import { NOTES } from '../avis.model';

@Component({
  selector: 'app-avis-form',
  templateUrl: './avis-form.component.html',
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
export class AvisFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  avisId: string | null = null;
  
  acheteurs: any[] = [];
  produitsParBoutique: any[] = [];
  notes = NOTES;

  constructor(
    private fb: FormBuilder,
    private service: AvisService,
    private produitService: ProduitParBoutiqueService,
    private acheteurService: AcheteurService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      idAcheteur: ['', Validators.required],
      idProduitParBoutique: ['', Validators.required],
      note: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      commentaire: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.avisId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.avisId && this.avisId !== 'nouveau';

    // Charger les données
    this.acheteurService.getAcheteurs().subscribe({
      next: (data) => this.acheteurs = data
    });

    this.produitService.getProduitsParBoutique().subscribe({
      next: (data) => this.produitsParBoutique = data
    });

    if (this.isEditMode && this.avisId) {
      this.loadAvis(this.avisId);
    }
  }

  loadAvis(id: string): void {
    this.service.getAvisById(id).subscribe({
      next: (avis) => {
        if (avis) {
          this.form.patchValue({
            idAcheteur: avis.idAcheteur,
            idProduitParBoutique: avis.idProduitParBoutique,
            note: avis.note,
            commentaire: avis.commentaire
          });
        }
      }
    });
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.form.get('idAcheteur')?.valid) progress += 25;
    if (this.form.get('idProduitParBoutique')?.valid) progress += 25;
    if (this.form.get('note')?.valid) progress += 25;
    if (this.form.get('commentaire')?.valid) progress += 25;
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

    if (this.isEditMode && this.avisId) {
      this.service.updateAvis(this.avisId, formData).subscribe({
        next: () => this.router.navigate(['/avis'])
      });
    } else {
      this.service.createAvis(formData).subscribe({
        next: () => this.router.navigate(['/avis'])
      });
    }
  }
}