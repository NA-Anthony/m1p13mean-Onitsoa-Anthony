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
import { LivraisonService } from '../livraison.service';
import { CommandeService } from '../../commande/commande.service';
import { LIVREURS } from '../livraison.model';

@Component({
  selector: 'app-livraison-form',
  templateUrl: './livraison-form.component.html',
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
export class LivraisonFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  livraisonId: string | null = null;
  
  commandes: any[] = [];
  livreurs = LIVREURS;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private service: LivraisonService,
    private commandeService: CommandeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      idCommande: ['', Validators.required],
      livreur: [''],
      numeroSuivi: [''],
      dateEstimee: ['', Validators.required],
      statut: ['en_attente']
    });
  }

  ngOnInit(): void {
    this.livraisonId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.livraisonId && this.livraisonId !== 'nouveau';

    // Charger les commandes sans livraison
    this.commandeService.getCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
      }
    });

    if (this.isEditMode && this.livraisonId) {
      this.loadLivraison(this.livraisonId);
    }
  }

  loadLivraison(id: string): void {
    this.service.getLivraisonById(id).subscribe({
      next: (livraison) => {
        if (livraison) {
          this.form.patchValue({
            idCommande: livraison.idCommande,
            livreur: livraison.livreur,
            numeroSuivi: livraison.numeroSuivi,
            dateEstimee: livraison.dateEstimee ? 
              new Date(livraison.dateEstimee).toISOString().split('T')[0] : '',
            statut: livraison.statut
          });
        }
      }
    });
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.form.get('idCommande')?.valid) progress += 30;
    if (this.form.get('livreur')?.value) progress += 20;
    if (this.form.get('numeroSuivi')?.value) progress += 20;
    if (this.form.get('dateEstimee')?.valid) progress += 30;
    return progress;
  }

  getCommandesDisponibles(): any[] {
    if (this.isEditMode) {
      return this.commandes;
    }
    // En mode création, filtrer les commandes qui n'ont pas déjà une livraison
    // Cette logique serait à implémenter avec un vrai service
    return this.commandes;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.form.value;

    if (this.isEditMode && this.livraisonId) {
      this.service.updateLivraison(this.livraisonId, formData).subscribe({
        next: () => this.router.navigate(['/livraisons'])
      });
    } else {
      this.service.createLivraison(formData).subscribe({
        next: () => this.router.navigate(['/livraisons'])
      });
    }
  }
}