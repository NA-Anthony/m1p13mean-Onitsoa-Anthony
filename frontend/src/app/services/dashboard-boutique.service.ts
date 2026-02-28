import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardBoutiqueService {
  private apiUrl = 'https://m1p13mean-onitsoa-anthony.onrender.com/api/dashboard-boutique';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les statistiques pour le dashboard boutique
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  /**
   * Récupère les commandes avec pagination
   */
  getCommandes(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/commandes?page=${page}&limit=${limit}`);
  }

  /**
   * Récupère tous les produits
   */
  getProduits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produits`);
  }

  /**
   * Récupère les avis avec pagination
   */
  getAvis(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/avis?page=${page}&limit=${limit}`);
  }
}