import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PortefeuilleService {
    private apiUrl = 'http://localhost:3000/api/portefeuille';

    constructor(private http: HttpClient) { }

    /**
     * Faire un dépôt d'argent (Acheteur)
     */
    deposerArgent(montant: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/depot`, { montant });
    }

    /**
     * Obtenir le solde actuel de l'acheteur
     */
    getSoldeAcheteur(): Observable<{ solde: number }> {
        return this.http.get<{ solde: number }>(`${this.apiUrl}/solde`);
    }

    /**
     * Obtenir la caisse de la boutique connectée
     */
    getCaisseBoutique(): Observable<{ caisse: number }> {
        return this.http.get<{ caisse: number }>(`${this.apiUrl}/caisse`);
    }

    /**
     * Obtenir l'historique des transactions financières
     */
    getTransactions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/transactions`);
    }
}
