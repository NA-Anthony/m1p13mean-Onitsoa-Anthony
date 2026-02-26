import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from './produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:3000/api/produits';
  private apiAdminUrl = 'http://localhost:3000/api/produits-admin';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les produits (public)
   */
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  /**
   * Récupère un produit par ID
   * Le backend peut retourner { produit, boutiques } ou directement le produit
   */
  getProduitById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau produit (admin)
   */
  createProduit(produit: Partial<Produit>): Observable<Produit> {
    return this.http.post<Produit>(this.apiAdminUrl, produit);
  }

  /**
   * Met à jour un produit (admin)
   */
  updateProduit(id: string, produit: Partial<Produit>): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiAdminUrl}/${id}`, produit);
  }

  /**
   * Supprime un produit (admin)
   */
  deleteProduit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiAdminUrl}/${id}`);
  }

  /**
   * Récupère tous les produits (admin)
   */
  getAllProduitsAdmin(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiAdminUrl}/all`);
  }
}