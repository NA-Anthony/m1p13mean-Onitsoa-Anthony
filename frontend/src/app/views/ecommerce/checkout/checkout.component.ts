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
    ProgressModule,  // ← AJOUTER DANS LES IMPORTS
    IconModule
  ]
})
export class CheckoutComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private cartService: CartService,
        private commandeService: CommandeService,
        private acheteurService: AcheteurService,
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
  checkoutForm: FormGroup;
  acheteurs: any[] = [];
  items = this.cartService.getPanier();
  sousTotal = this.cartService.sousTotal;
  fraisLivraison = this.cartService.fraisLivraison;
  total = this.cartService.total;
  
  modesPaiement = MODES_PAIEMENT;
  step: 'info' | 'paiement' | 'confirmation' = 'info';

  ngOnInit(): void {
    if (this.items.length === 0) {
      this.router.navigate(['/catalogue']);
      return;
    }

    this.acheteurService.getAcheteurs().subscribe({
      next: (data) => this.acheteurs = data
    });
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
    if (this.checkoutForm.get('idAcheteur')?.valid && 
        this.checkoutForm.get('adresseLivraison')?.valid) {
      this.step = 'paiement';
    } else {
      // CORRECTION : Vérifier que adresseLivraison existe et a des contrôles
      const adresseGroup = this.checkoutForm.get('adresseLivraison');
      if (adresseGroup instanceof FormGroup) {
        Object.keys(adresseGroup.controls).forEach(key => {
          adresseGroup.get(key)?.markAsTouched();
        });
      }
    }
  }

  validerPaiement(): void {
    if (this.checkoutForm.get('modePaiement')?.valid) {
      this.step = 'confirmation';
    }
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

    const commande = {
      idAcheteur: this.checkoutForm.value.idAcheteur,
      idBoutique: idBoutique,
      articles: articles,
      adresseLivraison: this.checkoutForm.value.adresseLivraison,
      fraisLivraison: this.fraisLivraison(),
      total: this.total(),
      modePaiement: this.checkoutForm.value.modePaiement,
      paiementEffectue: this.checkoutForm.value.modePaiement === 'Carte bancaire'
    };

    this.commandeService.createCommande(commande).subscribe({
      next: (cmd) => {
        this.cartService.viderPanier();
        this.router.navigate(['/commande-confirmee', cmd._id]);
      }
    });
  }

  retourPanier(): void {
    this.router.navigate(['/panier']);
  }
}