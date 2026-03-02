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
  ProgressModule  
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CartService } from '../cart.service';
import { CommandeService } from '../../commande/commande.service';
import { AcheteurService } from '../../acheteur/acheteur.service';
import { PortefeuilleService } from '../portefeuille.service';
import { MODES_PAIEMENT } from '../../commande/commande.model';
import { SpinnerModule } from '@coreui/angular'; 

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
    IconModule,
    SpinnerModule  
  ]
})
export class CheckoutComponent implements OnInit {

  checkoutForm!: FormGroup;
  acheteurId: string = ''; 
  items: any[] = [];
  sousTotal: any;
  fraisLivraison: any;
  total: any;
  soldeActuel: number | null = null;
  modesPaiement = MODES_PAIEMENT;
  step: 'adresse' | 'paiement' | 'confirmation' = 'adresse';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private commandeService: CommandeService,
    private acheteurService: AcheteurService,
    private portefeuilleService: PortefeuilleService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      modePaiement: ['', Validators.required],
      adresseLivraison: this.fb.group({
        rue: ['', Validators.required],
        codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        ville: ['', Validators.required],
        pays: ['France']
      })
    });
  }

  ngOnInit(): void {
    this.items = this.cartService.getPanier();
    this.sousTotal = this.cartService.sousTotal;
    this.fraisLivraison = this.cartService.fraisLivraison;
    this.total = this.cartService.total;

    if (this.items.length === 0) {
      this.router.navigate(['/ecommerce/catalogue']);
      return;
    }

    // Récupérer l'acheteur connecté + son solde automatiquement
    this.portefeuilleService.getSoldeAcheteur().subscribe({
      next: (res: any) => {
        this.soldeActuel = res.solde;
        // Si l'API retourne aussi l'id de l'acheteur :
        // this.acheteurId = res.idAcheteur;
      }
    });

    // Écouter le changement de mode de paiement
    this.checkoutForm.get('modePaiement')?.valueChanges.subscribe(() => {
      // force la réévaluation du template
    });
  }

  isSoldeInsuffisant(): boolean {
    if (this.soldeActuel === null) return false;
    return this.checkoutForm.get('modePaiement')?.value === 'Portefeuille numérique'
      && this.soldeActuel < this.total();
  }

  getPrixItem(item: any): number {
    return item.enPromotion && item.prixPromo ? item.prixPromo : item.prix;
  }

  validerAdresse(): void {
    const adresseGroup = this.checkoutForm.get('adresseLivraison') as FormGroup;
    Object.keys(adresseGroup.controls).forEach(f => adresseGroup.get(f)?.markAsTouched());
    // if (adresseGroup.valid) {
      this.step = 'paiement';
    // }
  }

  validerPaiement(): void {
    if (this.checkoutForm.get('modePaiement')?.valid && !this.isSoldeInsuffisant()) {
      this.step = 'confirmation';
    }
  }

  confirmerCommande(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const articles = this.items.map(item => ({
      idProduitParBoutique: item.idProduitParBoutique,
      nomProduit: item.nomProduit,
      prixUnitaire: item.prix,
      quantite: item.quantite,
      remise: item.prixPromo ? (item.prix - item.prixPromo) : 0
    }));

    const modePaiementForm = this.checkoutForm.value.modePaiement;
    const modePaiementData = modePaiementForm === 'Portefeuille numérique' ? 'portefeuille' : modePaiementForm;

    const commande = {
      idAcheteur: this.acheteurId,
      idBoutique: this.items[0]?.idBoutique,
      articles,
      adresseLivraison: this.checkoutForm.value.adresseLivraison,
      fraisLivraison: this.fraisLivraison(),
      total: this.total(),
      modePaiement: modePaiementData,
      paiementEffectue: modePaiementData === 'portefeuille' || modePaiementForm === 'Carte bancaire'
    };

    this.commandeService.createCommande(commande).subscribe({
      next: (cmd: any) => {
        this.cartService.viderPanier();
        this.router.navigate(['/ecommerce/portefeuille']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la commande', err);
        this.isSubmitting = false; 
      }
    });
  }

  retourPanier(): void {
    this.router.navigate(['/ecommerce/panier']);
  }
}