import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule, GridModule, ButtonModule, BadgeModule,
  TableModule, SpinnerModule, AvatarModule, AlertModule,
  ListGroupModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommandeService } from '../commande.service';

@Component({
  selector: 'app-commande-detail',
  templateUrl: './commande-detail.component.html',
  standalone: true,
  imports: [
    CommonModule, RouterModule, CardModule, GridModule,
    ButtonModule, BadgeModule, TableModule, IconModule,
    SpinnerModule, AvatarModule, AlertModule, ListGroupModule
  ]
})
export class CommandeDetailComponent implements OnInit {
  commande: any = null; // Utilisation de any pour éviter les conflits de type stricts avec idAcheteur
  loading = true;
  error: string | null = null;
  protected window = window;

  statutColors: Record<string, string> = {
    'en_attente': 'warning',
    'confirmée': 'info',
    'préparée': 'primary',
    'expédiée': 'secondary',
    'livrée': 'success',
    'annulée': 'danger'
  };

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCommande(id);
    }
  }

  loadCommande(id: string): void {
  this.loading = true;
  this.error = null;
  
  // On précise <any> ici pour accepter l'objet enveloppe du Backend
  this.commandeService.getCommandeById(id).subscribe({
    next: (data: any) => { 
      if (data && data.commande) {
        // Ici on extrait la commande réelle pour la stocker dans notre variable
        this.commande = data.commande; 
      } else {
        this.commande = data;
      }
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Commande introuvable ou erreur serveur';
      console.error(err);
      this.loading = false;
    }
  });
}
  formatDate(date: any): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getStatutColor(statut: string): string {
    return this.statutColors[statut] || 'secondary';
  }

  getSousTotal(): number {
    if (!this.commande?.articles) return 0;
    return this.commande.articles.reduce((acc: number, art: any) => {
      return acc + ((art.prixUnitaire - (art.remise || 0)) * art.quantite);
    }, 0);
  }
}