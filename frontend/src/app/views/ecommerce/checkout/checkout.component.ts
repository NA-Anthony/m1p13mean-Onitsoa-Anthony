import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  FormModule,
  ProgressModule  // ← AJOUTER CET IMPORT
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CartService } from '../cart.service';
import { CommandeService } from '../../commande/commande.service';
import { AcheteurService } from '../../acheteur/acheteur.service';
import { PortefeuilleService } from '../portefeuille.service';
import { MODES_PAIEMENT } from '../../commande/commande.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    FormModule,
    ProgressModule,
    IconModule
  ]
})
export class CheckoutComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private commandeService: CommandeService,
    private acheteurService: AcheteurService,
    private portefeuilleService: PortefeuilleService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      idAcheteur: ['', Validators.required],
      modePaiement: ['', Validators.required],
      adresseLivraison: this.fb.group({
        rue: ['', Validators.required],
        codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        ville: ['', Validators.required],
        pays: ['France']
      })
    });
  }
  checkoutForm!: FormGroup;
  acheteurs: any[] = [];
  items: any[] = [];
  sousTotal: any;
  fraisLivraison: any;
  total: any;
  soldeActuel: number = 0;

  modesPaiement = MODES_PAIEMENT;
  step: 'info' | 'paiement' | 'confirmation' = 'info';

  ngOnInit(): void {
    this.items = this.cartService.getPanier();
    this.sousTotal = this.cartService.sousTotal;
    this.fraisLivraison = this.cartService.fraisLivraison;
    this.total = this.cartService.total;

    if (this.items.length === 0) {
      this.router.navigate(['/ecommerce/catalogue']);
      return;
    }

    this.acheteurService.getAcheteurs().subscribe({
      next: (data: any[]) => this.acheteurs = data
    });

    // Écouter le changement d'acheteur pour charger son solde
    this.checkoutForm.get('idAcheteur')?.valueChanges.subscribe(id => {
      if (id) {
        this.chargerSoldeAcheteur(id);
      }
    });
  }

  chargerSoldeAcheteur(id: string): void {
    this.portefeuilleService.getSoldeAcheteur().subscribe({
      next: (res: any) => {
        this.soldeActuel = res.solde;
      }
    });
  }

  isSoldeInsuffisant(): boolean {
  console.log('solde:', this.soldeActuel, 'total:', this.total());
  return this.checkoutForm.get('modePaiement')?.value === 'Portefeuille numérique' 
    && this.soldeActuel < this.total();
}

  getPrixItem(item: any): number {
    return item.enPromotion && item.prixPromo ? item.prixPromo : item.prix;
  }

  getTotalBoutique(items: any[]): number {
    return items.reduce((acc, item) => {
      const prix = this.getPrixItem(item);
      return acc + (prix * item.quantite);
    }, 0);
  }

  validerInformations(): void {
    // Marquer tous les champs comme touched pour afficher les erreurs
    this.checkoutForm.get('idAcheteur')?.markAsTouched();

    const adresseGroup = this.checkoutForm.get('adresseLivraison');
    if (adresseGroup instanceof FormGroup) {
      Object.keys(adresseGroup.controls).forEach(field => {
        const control = adresseGroup.get(field);
        control?.markAsTouched();
      });
    }

    // Vérifier la validité
    // if (this.checkoutForm.get('idAcheteur')?.valid && 
    //     adresseGroup?.valid) {
    this.step = 'paiement';
    // }
  }

  validerPaiement(): void {
    // if (this.checkoutForm.get('modePaiement')?.valid) {
    this.step = 'confirmation';
    // }
  }

  confirmerCommande(): void {
    // Grouper les articles par boutique
    const articles = this.items.map(item => ({
      idProduitParBoutique: item.idProduitParBoutique,
      nomProduit: item.nomProduit,
      prixUnitaire: item.prix,
      quantite: item.quantite,
      remise: item.prixPromo ? (item.prix - item.prixPromo) : 0
    }));

    // Récupérer la première boutique (simplifié)
    const idBoutique = this.items[0]?.idBoutique;

    const modePaiementForm = this.checkoutForm.value.modePaiement;
    const modePaiementData = modePaiementForm === 'Portefeuille numérique' ? 'portefeuille' : modePaiementForm;

    const commande = {
      idAcheteur: this.checkoutForm.value.idAcheteur,
      idBoutique: idBoutique,
      articles: articles,
      adresseLivraison: this.checkoutForm.value.adresseLivraison,
      fraisLivraison: this.fraisLivraison(),
      total: this.total(),
      modePaiement: modePaiementData,
      paiementEffectue: modePaiementData === 'portefeuille' || modePaiementForm === 'Carte bancaire'
    };

    this.commandeService.createCommande(commande).subscribe({
      next: (cmd: any) => {
        this.cartService.viderPanier();
        this.router.navigate(['/commande-confirmee', cmd._id]);
      }
    });
  }

  retourPanier(): void {
    this.router.navigate(['/panier']);
  }
}