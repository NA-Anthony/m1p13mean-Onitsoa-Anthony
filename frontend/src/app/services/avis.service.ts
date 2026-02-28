import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = 'https://m1p13mean-onitsoa-anthony.onrender.com/api/avis';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les avis avec pagination
   */
  getAvis(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  /**
   * Récupère un avis par ID
   */
  getAvisById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère les avis d'un produit
   */
  getAvisByProduit(idProduitParBoutique: string, page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/produit/${idProduitParBoutique}?page=${page}&limit=${limit}`);
  }

  /**
   * Récupère les avis d'un acheteur
   */
  getAvisByAcheteur(idAcheteur: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/acheteur/${idAcheteur}`);
  }

  /**
   * Crée un nouvel avis (acheteur)
   */
  createAvis(avis: { idProduitParBoutique: string; note: number; commentaire: string }): Observable<any> {
    return this.http.post(this.apiUrl, avis);
  }

  /**
   * Modifie son avis (acheteur)
   */
  updateAvis(id: string, avis: { note?: number; commentaire?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, avis);
  }

  /**
   * Répond à un avis (boutique)
   */
  repondreAvis(id: string, reponse: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/repondre`, { reponse });
  }

  /**
   * Supprime un avis (admin ou auteur)
   */
  deleteAvis(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}