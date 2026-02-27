import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boutique } from './boutique.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  private apiUrl = 'http://localhost:3000/api/boutiques';
  private apiAdminUrl = 'http://localhost:3000/api/boutiques-admin';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les boutiques (publiques)
   */
  getBoutiques(): Observable<Boutique[]> {
    return this.http.get<Boutique[]>(this.apiUrl);
  }

  /**
   * Récupère une boutique par ID
   * Backend retourne { boutique, produits, totalProduits }
   */
  getBoutiqueById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée une nouvelle boutique (admin)
   */
  createBoutique(boutique: Partial<Boutique>): Observable<Boutique> {
    return this.http.post<Boutique>(this.apiAdminUrl, boutique);
  }

  /**
   * Met à jour une boutique (admin)
   */
  updateBoutique(id: string, boutique: Partial<Boutique>): Observable<Boutique> {
    return this.http.put<Boutique>(`${this.apiAdminUrl}/${id}`, boutique);
  }

  /**
   * Supprime une boutique (admin)
   */
  deleteBoutique(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiAdminUrl}/${id}`);
  }

  /**
   * Récupère toutes les boutiques avec données enrichies (admin)
   */
  getAllBoutiquesAdmin(): Observable<Boutique[]> {
    return this.http.get<Boutique[]>(`${this.apiAdminUrl}/all`);
  }

  /**
   * Récupère les statistiques des boutiques (admin)
   */
  getBoutiqueStats(): Observable<any> {
    return this.http.get<any>(`${this.apiAdminUrl}/stats`);
  }
}