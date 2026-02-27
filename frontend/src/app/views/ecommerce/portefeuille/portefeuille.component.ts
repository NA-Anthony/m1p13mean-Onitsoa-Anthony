import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    CardModule,
    GridModule,
    ButtonModule,
    FormModule,
    TableModule,
    BadgeModule,
    SpinnerModule
} from '@coreui/angular';
import { PortefeuilleService } from '../portefeuille.service';
import { IconModule } from '@coreui/icons-angular';

@Component({
    selector: 'app-portefeuille',
    templateUrl: './portefeuille.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        GridModule,
        ButtonModule,
        FormModule,
        TableModule,
        BadgeModule,
        SpinnerModule,
        IconModule
    ]
})
export class PortefeuilleComponent implements OnInit {
    solde = 0;
    montantDepot = 10;
    transactions: any[] = [];
    loading = true;
    submitting = false;

    constructor(private portefeuilleService: PortefeuilleService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.portefeuilleService.getSoldeAcheteur().subscribe({
            next: (res) => {
                this.solde = res.solde;
                this.loadTransactions();
            },
            error: (err) => console.error(err)
        });
    }

    loadTransactions(): void {
        this.portefeuilleService.getTransactions().subscribe({
            next: (res) => {
                this.transactions = res;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    effectuerDepot(): void {
        if (this.montantDepot <= 0) return;

        this.submitting = true;
        this.portefeuilleService.deposerArgent(this.montantDepot).subscribe({
            next: (res) => {
                this.solde = res.solde;
                this.montantDepot = 10;
                this.submitting = false;
                this.loadTransactions();
                alert('Dépôt effectué avec succès !');
            },
            error: (err) => {
                console.error(err);
                this.submitting = false;
                alert('Erreur lors du dépôt.');
            }
        });
    }

    getStatusColor(type: string): string {
        switch (type) {
            case 'depot': return 'success';
            case 'vente': return 'info';
            case 'achat': return 'danger';
            default: return 'secondary';
        }
    }
}
