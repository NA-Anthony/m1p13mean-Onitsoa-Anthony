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
import { CommandeService } from '../commande.service';
import { AcheteurService } from '../../acheteur/acheteur.service';
import { BoutiqueService } from '../../boutique/boutique.service';
import { MODES_PAIEMENT } from '../commande.model';

@Component({
  selector: 'app-commande-form',
  templateUrl: './commande-form.component.html',
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
export class CommandeFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  commandeId: string | null = null;
  
  acheteurs: any[] = [];
  boutiques: any[] = [];
  modesPaiement = MODES_PAIEMENT;

  constructor(
    private fb: FormBuilder,
    private service: CommandeService,
    private acheteurService: AcheteurService,
    private boutiqueService: BoutiqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      idAcheteur: ['', Validators.required],
      idBoutique: ['', Validators.required],
      adresseLivraison: this.fb.group({
        rue: ['', Validators.required],
        ville: ['', Validators.required],
        codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        pays: ['France']
      }),
      articles: this.fb.array([]),
      fraisLivraison: [0, [Validators.required, Validators.min(0)]],
      modePaiement: ['', Validators.required],
      paiementEffectue: [false]
    });
  }

  get articlesArray() {
    return this.form.get('articles') as FormArray;
  }

  ngOnInit(): void {
    this.commandeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.commandeId && this.commandeId !== 'nouveau';

    // Charger les données
    this.acheteurService.getAcheteurs().subscribe({
      next: (data) => this.acheteurs = data
    });

    this.boutiqueService.getBoutiques().subscribe({
      next: (data) => this.boutiques = data
    });

    if (this.isEditMode && this.commandeId) {
      this.loadCommande(this.commandeId);
    } else {
      this.ajouterArticle();
    }
  }

  loadCommande(id: string): void {
    this.service.getCommandeById(id).subscribe({
      next: (commande) => {
        if (commande) {
          this.form.patchValue({
            idAcheteur: commande.idAcheteur,
            idBoutique: commande.idBoutique,
            adresseLivraison: commande.adresseLivraison,
            fraisLivraison: commande.fraisLivraison,
            modePaiement: commande.modePaiement,
            paiementEffectue: commande.paiementEffectue
          });

          // Vider et recharger les articles
          this.articlesArray.clear();
          commande.articles.forEach(article => {
            this.articlesArray.push(this.fb.group({
              nomProduit: [article.nomProduit, Validators.required],
              prixUnitaire: [article.prixUnitaire, [Validators.required, Validators.min(0)]],
              quantite: [article.quantite, [Validators.required, Validators.min(1)]],
              remise: [article.remise || 0, [Validators.min(0)]]
            }));
          });
        }
      }
    });
  }

  ajouterArticle(): void {
    const articleForm = this.fb.group({
      nomProduit: ['', Validators.required],
      prixUnitaire: ['', [Validators.required, Validators.min(0)]],
      quantite: ['', [Validators.required, Validators.min(1)]],
      remise: [0, [Validators.min(0)]]
    });
    this.articlesArray.push(articleForm);
  }

  supprimerArticle(index: number): void {
    this.articlesArray.removeAt(index);
  }

  calculerTotal(): number {
    let total = 0;
    
    // Sous-total des articles
    for (let i = 0; i < this.articlesArray.length; i++) {
      const article = this.articlesArray.at(i).value;
      total += (article.prixUnitaire - article.remise) * article.quantite;
    }
    
    // Frais de livraison
    total += this.form.get('fraisLivraison')?.value || 0;
    
    return total;
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.form.get('idAcheteur')?.valid) progress += 20;
    if (this.form.get('idBoutique')?.valid) progress += 20;
    if (this.form.get('adresseLivraison')?.valid) progress += 20;
    if (this.articlesArray.length > 0 && this.articlesArray.valid) progress += 20;
    if (this.form.get('modePaiement')?.valid) progress += 20;
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
    formData.total = this.calculerTotal();

    if (this.isEditMode && this.commandeId) {
      this.service.updateCommande(this.commandeId, formData).subscribe({
        next: () => this.router.navigate(['/commandes'])
      });
    } else {
      this.service.createCommande(formData).subscribe({
        next: () => this.router.navigate(['/commandes'])
      });
    }
  }
}