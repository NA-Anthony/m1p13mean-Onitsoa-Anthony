import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private baseUrl = 'http://localhost:3000/api';

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
   * Obtenir une commande par ID
   */
  getCommandeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/commandes/${id}`);
  }
}
