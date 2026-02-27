import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ProduitParBoutiqueService } from '../produit-par-boutique.service';
import { AuthService } from '../../../services/auth.service';

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
    AlertModule,
    SpinnerModule,
    IconModule
  ]
})
export class ProduitParBoutiqueFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: string | null = null;
  
  produits: any[] = [];
  
  // États
  loading = false;
  saving = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  // Rôles
  isAdmin = false;
  isBoutique = false;

  constructor(
    private fb: FormBuilder,
    private service: ProduitParBoutiqueService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    const user = this.authService.getCurrentUser();
    const role = user?.role;
    this.isAdmin = role === 'admin';
    this.isBoutique = role === 'boutique';

    this.form = this.fb.group({
      idProduit: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Rediriger si admin (ne peut pas créer/modifier)
    if (this.isAdmin) {
      this.router.navigate(['/produits-par-boutique']);
      return;
    }

    this.itemId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.itemId && this.itemId !== 'nouveau';

    // Charger la liste des produits
    this.loadProduits();

    if (this.isEditMode && this.itemId) {
      this.loadItem(this.itemId);
    }
  }

  loadProduits(): void {
    this.loading = true;
    this.http.get('http://localhost:3000/api/produits').subscribe({
      next: (data: any) => {
        this.produits = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des produits';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadItem(id: string): void {
    this.loading = true;
    this.service.getProduitParBoutiqueById(id).subscribe({
      next: (item: any) => {
        if (item) {
          // Vérifier si idProduit est un objet ou un ID
          const produitId = typeof item.idProduit === 'object' ? item.idProduit._id : item.idProduit;
          
          this.form.patchValue({
            idProduit: produitId,
            prix: item.prix,
            stock: item.stock
          });
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.msg || 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.form.get('idProduit')?.valid) progress += 40;
    if (this.form.get('prix')?.valid) progress += 30;
    if (this.form.get('stock')?.valid) progress += 30;
    return progress;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving = true;
    this.error = null;

    const formData = this.form.value;

    if (this.isEditMode && this.itemId) {
      this.service.updateProduitParBoutique(this.itemId, formData).subscribe({
        next: () => {
          this.successMessage = 'Produit mis à jour avec succès';
          setTimeout(() => {
            this.router.navigate(['/produits-par-boutique']);
          }, 1500);
        },
        error: (err) => {
          this.error = err.error?.msg || 'Erreur lors de la mise à jour';
          this.saving = false;
          console.error(err);
        }
      });
    } else {
      this.service.createProduitParBoutique(formData).subscribe({
        next: () => {
          this.successMessage = 'Produit ajouté avec succès';
          setTimeout(() => {
            this.router.navigate(['/produits-par-boutique']);
          }, 1500);
        },
        error: (err) => {
          this.error = err.error?.msg || 'Erreur lors de l\'ajout';
          this.saving = false;
          console.error(err);
        }
      });
    }
  }
}