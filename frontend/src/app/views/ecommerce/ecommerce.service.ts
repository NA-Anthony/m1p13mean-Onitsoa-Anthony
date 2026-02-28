import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private baseUrl = 'https://m1p13mean-onitsoa-anthony.onrender.com/api';

  constructor(private http: HttpClient) {}

  /**
   * Créer une commande
   */
  createCommande(payload: {
    idBoutique: string;
    articles: Array<{ idProduitParBoutique: string; quantite: number }>;
    adresseLivraison: any;
    fraisLivraison: number;
    modePaiement: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/commandes`, payload);
  }

  /**
   * Obtenir les commandes de l'acheteur connecté
   */
  getMesCommandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/commandes/acheteur`);
  }

  /**
   * Obtenir les commandes reçues par la boutique connectée
   */
  getCommandesBoutique(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/commandes/boutique`);
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  updateStatut(id: string, statut: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/commandes/${id}/statut`, { statut });
  }

  /**
   * Mettre à jour le paiement d'une commande
   */
  updatePaiement(id: string, paiementEffectue: boolean, modePaiement?: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/commandes/${id}/paiement`, { paiementEffectue, modePaiement });
  }

  /**
   * Obtenir une commande par ID
   */
  getCommandeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/commandes/${id}`);
  }
}
