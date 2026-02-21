import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CardModule,
  FormModule,
  GridModule,
  ButtonModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { TarifLivraisonService } from '../tarif-livraison.service';
import { BoutiqueService } from '../../boutique/boutique.service';

@Component({
  selector: 'app-tarif-livraison-form',
  templateUrl: './tarif-livraison-form.component.html',
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
export class TarifLivraisonFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  tarifId: string | null = null;
  
  boutiques: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: TarifLivraisonService,
    private boutiqueService: BoutiqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      idBoutique: ['', Validators.required],
      zoneGratuite: [0, [Validators.required, Validators.min(0)]],
      tarifs: this.fb.array([])
    });
  }

  get tarifsArray() {
    return this.form.get('tarifs') as FormArray;
  }

  ngOnInit(): void {
    this.tarifId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.tarifId && this.tarifId !== 'nouveau';

    // Charger les boutiques
    this.boutiqueService.getBoutiques().subscribe({
      next: (data) => {
        this.boutiques = data;
      }
    });

    if (this.isEditMode && this.tarifId) {
      this.loadTarif(this.tarifId);
    } else {
      this.ajouterTranche();
    }
  }

  loadTarif(id: string): void {
    this.service.getTarifById(id).subscribe({
      next: (tarif) => {
        if (tarif) {
          this.form.patchValue({
            idBoutique: tarif.idBoutique,
            zoneGratuite: tarif.zoneGratuite
          });

          // Vider et recharger les tranches
          this.tarifsArray.clear();
          tarif.tarifs.forEach(t => {
            this.tarifsArray.push(this.fb.group({
              distanceMin: [t.distanceMin, [Validators.required, Validators.min(0)]],
              distanceMax: [t.distanceMax, [Validators.required, Validators.min(0)]],
              prix: [t.prix, [Validators.required, Validators.min(0)]]
            }));
          });
        }
      }
    });
  }

  ajouterTranche(): void {
    const lastIndex = this.tarifsArray.length - 1;
    let distanceMin = 0;
    
    if (lastIndex >= 0) {
      const lastTranche = this.tarifsArray.at(lastIndex).value;
      distanceMin = lastTranche.distanceMax;
    }

    const trancheForm = this.fb.group({
      distanceMin: [distanceMin, [Validators.required, Validators.min(0)]],
      distanceMax: [distanceMin + 5, [Validators.required, Validators.min(0)]],
      prix: ['', [Validators.required, Validators.min(0)]]
    });

    this.tarifsArray.push(trancheForm);
  }

  supprimerTranche(index: number): void {
    this.tarifsArray.removeAt(index);
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.form.get('idBoutique')?.valid) progress += 30;
    if (this.form.get('zoneGratuite')?.valid) progress += 20;
    if (this.tarifsArray.length > 0 && this.tarifsArray.valid) progress += 50;
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

    if (this.isEditMode && this.tarifId) {
      this.service.updateTarif(this.tarifId, formData).subscribe({
        next: () => this.router.navigate(['/tarifs-livraison'])
      });
    } else {
      this.service.createTarif(formData).subscribe({
        next: () => this.router.navigate(['/tarifs-livraison'])
      });
    }
  }
}