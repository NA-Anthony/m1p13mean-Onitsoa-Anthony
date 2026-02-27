import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  CardModule, 
  TableModule, 
  ButtonModule, 
  BadgeModule, 
  SpinnerModule,
  AvatarModule,
  GridModule,
  AlertModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommandeService } from '../commande.service';

@Component({
  selector: 'app-commande-boutique-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    CardModule, 
    TableModule, 
    ButtonModule, 
    BadgeModule, 
    IconModule,
    SpinnerModule,
    AvatarModule,
    GridModule,
    AlertModule
  ],
  templateUrl: './commande-boutique-list.component.html',
  styles: [`
    .bg-primary-soft {
      background-color: rgba(var(--cui-primary-rgb), 0.1);
    }
    .bg-info-soft {
      background-color: rgba(var(--cui-info-rgb), 0.1);
    }
    .border-bottom-dashed {
      border-bottom: 1px dashed #dee2e6;
    }
    .border-bottom-dashed:last-child {
      border-bottom: none;
    }
    @media (min-width: 768px) {
      .border-end-md {
        border-right: 1px solid #efefef;
      }
    }
    .form-select:focus {
      border-color: var(--cui-primary);
      box-shadow: 0 0 0 0.25rem rgba(var(--cui-primary-rgb), 0.25);
    }
  `]
})
export class CommandeBoutiqueListComponent implements OnInit {
  commandes: any[] = [];
  loading = true;
  error: string | null = null;
  statuts = ['en_attente', 'confirmée', 'préparée', 'expédiée', 'livrée', 'annulée'];

  constructor(private service: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading = true;
    this.service.getCommandesBoutique().subscribe({
      next: (data: any[]) => { 
        this.commandes = data; 
        this.loading = false; 
      },
      error: (err) => { 
        this.error = 'Erreur chargement commandes'; 
        console.error(err); 
        this.loading = false; 
      }
    });
  }

  changeStatut(cmdId: string, statut: string): void {
    this.service.updateStatut(cmdId, statut).subscribe({
      next: () => this.loadCommandes(),
      error: (err) => { 
        alert(err?.error?.msg || 'Erreur mise à jour statut'); 
        console.error(err); 
      }
    });
  }

  getInitials(acheteur: any): string {
    if (!acheteur) return 'A';
    const prenom = acheteur.prenom?.charAt(0)?.toUpperCase() || '';
    const nom = acheteur.nom?.charAt(0)?.toUpperCase() || '';
    return (prenom + nom) || 'A';
  }

  getPaymentIcon(modePaiement: string): string {
    switch(modePaiement) {
      case 'portefeuille':
      case 'Portefeuille numérique':
        return 'cil-wallet';
      case 'Virement bancaire':
        return 'cil-bank';
      case 'Carte bancaire':
        return 'cil-credit-card';
      default:
        return 'cil-money';
    }
  }
}