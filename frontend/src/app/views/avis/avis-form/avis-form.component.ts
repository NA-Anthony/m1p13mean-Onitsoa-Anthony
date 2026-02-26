import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CardModule,
  FormModule,
  GridModule,
  ButtonModule,
  ProgressModule,
  AlertModule,
  SpinnerModule,
  AvatarModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AvisService } from '../../../services/avis.service';
import { BoutiqueService } from '../../boutique/boutique.service';
import { ProduitParBoutiqueService } from '../../produit-par-boutique/produit-par-boutique.service';
import { CommandeService } from '../../commande/commande.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-avis-form',
  templateUrl: './avis-form.component.html',
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
    AvatarModule,
    IconModule
  ]
})
export class AvisFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  avisId: string | null = null;
  
  boutiques: any[] = [];
  selectedBoutique: any = null;
  
  produitsAchetes: any[] = [];
  produitsFiltres: any[] = [];
  produitsSelectionnes: Set<string> = new Set();
  produitsDejaNotes: Set<string> = new Set();
  
  selectedProduit: any = null;
  
  notes = [1, 2, 3, 4, 5];
  
  // États
  loading = false;
  loadingProduits = false;
  saving = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  // Recherche
  searchTerm: string = '';
  
  // ID de l'acheteur connecté
  acheteurId: string | null = null;
  utilisateurConnecte = false;

  constructor(
    private fb: FormBuilder,
    private avisService: AvisService,
    private boutiqueService: BoutiqueService,
    private produitService: ProduitParBoutiqueService,
    private commandeService: CommandeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.acheteurId = user.id || user._id;
      this.utilisateurConnecte = true;
    } else {
      this.utilisateurConnecte = false;
      this.router.navigate(['/login']);
    }

    // Initialiser le formulaire SANS validation pour boutiqueId en mode édition
    this.form = this.fb.group({
      boutiqueId: [''],
      note: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      commentaire: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.utilisateurConnecte) return;

    this.avisId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.avisId && this.avisId !== 'nouveau';

    // Appliquer la validation conditionnelle
    if (!this.isEditMode) {
      this.form.get('boutiqueId')?.setValidators([Validators.required]);
    }
    this.form.get('boutiqueId')?.updateValueAndValidity();

    this.loadBoutiques();

    const boutiqueId = this.route.snapshot.queryParamMap.get('boutiqueId');
    if (boutiqueId) {
      this.form.patchValue({ boutiqueId });
      this.onBoutiqueChange(boutiqueId);
    }

    if (this.isEditMode && this.avisId) {
      this.loadAvis(this.avisId);
    }
  }

  loadBoutiques(): void {
    this.loading = true;
    this.boutiqueService.getBoutiques().subscribe({
      next: (data: any[]) => {
        this.boutiques = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des boutiques';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onBoutiqueChange(boutiqueId: string): void {
    if (!boutiqueId) {
      this.selectedBoutique = null;
      this.produitsAchetes = [];
      this.produitsFiltres = [];
      this.produitsSelectionnes.clear();
      return;
    }

    this.selectedBoutique = this.boutiques.find(b => b.id === boutiqueId || b._id === boutiqueId);
    this.loadProduitsAchetes(boutiqueId);
  }

  loadProduitsAchetes(boutiqueId: string): void {
    if (!this.acheteurId) {
      this.error = 'Vous devez être connecté';
      return;
    }
  
    this.loadingProduits = true;
    this.produitsAchetes = [];
    this.produitsFiltres = [];
    this.produitsSelectionnes.clear();
    this.error = null;
  
    // 1. Récupérer les commandes de l'acheteur
    this.commandeService.getMesCommandes().subscribe({
      next: (commandes: any[]) => {
        console.log('Commandes reçues:', commandes);
        
        // Filtrer les commandes livrées de cette boutique
        const commandesLivrees = commandes.filter(c => {
          const boutiqueMatch = (c.idBoutique?.id === boutiqueId || c.idBoutique?._id === boutiqueId);
          const statutLivree = c.statut === 'livrée';
          return boutiqueMatch && statutLivree;
        });
  
        console.log('Commandes livrées trouvées:', commandesLivrees);
  
        if (commandesLivrees.length === 0) {
          this.produitsAchetes = [];
          this.produitsFiltres = [];
          this.loadingProduits = false;
          this.error = 'Vous n\'avez pas encore reçu de produits de cette boutique.';
          return;
        }
  
        // Extraire tous les produits achetés
        const produitsIds: Set<string> = new Set();
        commandesLivrees.forEach(c => {
          c.articles?.forEach((a: any) => {
            if (a.idProduitParBoutique) {
              produitsIds.add(a.idProduitParBoutique);
            }
          });
        });
  
        console.log('IDs produits trouvés:', Array.from(produitsIds));
  
        if (produitsIds.size === 0) {
          this.produitsAchetes = [];
          this.produitsFiltres = [];
          this.loadingProduits = false;
          this.error = 'Aucun produit trouvé dans vos commandes livrées.';
          return;
        }
  
        // 2. Récupérer les détails des produits
        this.produitService.getAllProduitsParBoutique().subscribe({
          next: (allProduits: any[]) => {
            console.log('Tous les produits:', allProduits);
            
            // Filtrer les produits achetés - Utiliser _id au lieu de id
            this.produitsAchetes = allProduits.filter(p => {
              // Vérifier si l'ID du produit correspond
              const idMatch = produitsIds.has(p._id);
              
              // Vérifier si la boutique correspond
              const boutiqueMatch = (
                p.idBoutique?._id === boutiqueId || 
                p.idBoutique?.id === boutiqueId || 
                p.boutique?._id === boutiqueId ||
                p.boutique?.id === boutiqueId
              );
              
              return idMatch && boutiqueMatch;
            });
  
            console.log('Produits achetés trouvés:', this.produitsAchetes);
  
            if (this.produitsAchetes.length === 0) {
              this.produitsFiltres = [];
              this.loadingProduits = false;
              this.error = 'Les produits de vos commandes n\'ont pas été trouvés dans le catalogue.';
              return;
            }
  
            // En mode création seulement, filtrer les produits déjà notés
            if (!this.isEditMode) {
              this.avisService.getAvisByAcheteur(this.acheteurId!).subscribe({
                next: (avis: any[]) => {
                  console.log('Avis déjà laissés:', avis);
                  
                  this.produitsDejaNotes.clear();
                  avis.forEach(a => {
                    const produitId = a.idProduitParBoutique?._id || a.idProduitParBoutique?.id || a.idProduitParBoutique;
                    if (produitId) {
                      this.produitsDejaNotes.add(produitId);
                    }
                  });
  
                  // Filtrer pour n'afficher que les produits non encore notés
                  this.produitsAchetes = this.produitsAchetes.filter(p => 
                    !this.produitsDejaNotes.has(p._id)
                  );
  
                  this.produitsFiltres = [...this.produitsAchetes];
                  this.loadingProduits = false;
  
                  if (this.produitsAchetes.length === 0) {
                    this.error = 'Vous avez déjà noté tous les produits que vous avez reçus de cette boutique.';
                  } else {
                    this.error = null;
                  }
                },
                error: (err: any) => {
                  console.error('Erreur chargement avis:', err);
                  this.produitsFiltres = [...this.produitsAchetes];
                  this.loadingProduits = false;
                }
              });
            } else {
              // En mode édition, on garde tous les produits achetés
              this.produitsFiltres = [...this.produitsAchetes];
              this.loadingProduits = false;
            }
          },
          error: (err: any) => {
            console.error('Erreur chargement produits:', err);
            this.error = 'Erreur lors du chargement des produits';
            this.loadingProduits = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Erreur chargement commandes:', err);
        this.error = 'Erreur lors du chargement de vos commandes';
        this.loadingProduits = false;
      }
    });
  }

  filterProduits(): void {
    if (!this.searchTerm.trim()) {
      this.produitsFiltres = [...this.produitsAchetes];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.produitsFiltres = this.produitsAchetes.filter(p => 
        (p.produit?.nom || p.idProduit?.nom || '').toLowerCase().includes(term)
      );
    }
  }

  toggleProduit(produitId: string): void {
    if (this.produitsSelectionnes.has(produitId)) {
      this.produitsSelectionnes.delete(produitId);
    } else {
      this.produitsSelectionnes.add(produitId);
    }
  }
  
  isProduitSelectionne(produitId: string): boolean {
    return this.produitsSelectionnes.has(produitId);
  }

  getProduitsSelectionnesCount(): number {
    return this.produitsSelectionnes.size;
  }

  loadAvis(id: string): void {
    this.loading = true;
    this.avisService.getAvisById(id).subscribe({
      next: (avis: any) => {
        if (avis) {
          this.form.patchValue({
            note: avis.note,
            commentaire: avis.commentaire
          });
          
          // Marquer les champs comme touchés
          this.form.get('note')?.markAsTouched();
          this.form.get('commentaire')?.markAsTouched();
          
          // Forcer la validation
          this.form.get('note')?.updateValueAndValidity();
          this.form.get('commentaire')?.updateValueAndValidity();
          
          // Charger le produit concerné
          if (avis.idProduitParBoutique) {
            this.selectedProduit = avis.idProduitParBoutique;
            if (this.selectedProduit.idBoutique) {
              this.selectedBoutique = this.selectedProduit.idBoutique;
            }
            
            // Ajouter le produit à la sélection
            const produitId = this.selectedProduit.id || this.selectedProduit._id;
            if (produitId) {
              this.produitsSelectionnes.add(produitId);
            }
          }
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.msg || 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.isEditMode) {
      if (this.form.get('note')?.valid) progress += 50;
      if (this.form.get('commentaire')?.valid) progress += 50;
    } else {
      if (this.form.get('boutiqueId')?.valid && this.produitsSelectionnes.size > 0) progress += 30;
      if (this.form.get('note')?.valid) progress += 30;
      if (this.form.get('commentaire')?.valid) progress += 40;
    }
    return progress;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        if (key !== 'boutiqueId' || !this.isEditMode) {
          this.form.get(key)?.markAsTouched();
        }
      });
      return;
    }

    if (!this.isEditMode && this.produitsSelectionnes.size === 0) {
      this.error = 'Veuillez sélectionner au moins un produit';
      return;
    }

    this.saving = true;
    this.error = null;

    const formData = {
      note: this.form.value.note,
      commentaire: this.form.value.commentaire
    };

    if (this.isEditMode && this.avisId) {
      this.avisService.updateAvis(this.avisId, formData).subscribe({
        next: () => {
          this.successMessage = 'Avis mis à jour avec succès';
          setTimeout(() => {
            this.router.navigate(['/avis']);
          }, 1500);
        },
        error: (err: any) => {
          this.error = err.error?.msg || 'Erreur lors de la mise à jour';
          this.saving = false;
          console.error(err);
        }
      });
    } else {
      const promises = [];
      const produitIds = Array.from(this.produitsSelectionnes);

      for (const produitId of produitIds) {
        promises.push(this.avisService.createAvis({
          idProduitParBoutique: produitId,
          note: formData.note,
          commentaire: formData.commentaire
        }).toPromise().catch(err => {
          console.error('Erreur pour le produit', produitId, err);
          return null;
        }));
      }

      Promise.all(promises)
        .then((results) => {
          const successCount = results.filter(r => r !== null).length;
          if (successCount > 0) {
            this.successMessage = `${successCount} avis créés avec succès`;
            setTimeout(() => {
              this.router.navigate(['/avis']);
            }, 1500);
          } else {
            this.error = 'Aucun avis n\'a pu être créé';
            this.saving = false;
          }
        })
        .catch((err) => {
          this.error = err.error?.msg || 'Erreur lors de la création des avis';
          this.saving = false;
          console.error(err);
        });
    }
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}