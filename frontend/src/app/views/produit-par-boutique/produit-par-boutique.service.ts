import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProduitParBoutique } from './produit-par-boutique.model';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProduitParBoutiqueService {
  private apiUrl = 'http://localhost:3000/api/produits/boutique';
  private apiAdminUrl = 'http://localhost:3000/api/produits-admin/all-produits-boutique';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllProduitsParBoutique(): Observable<ProduitParBoutique[]> {
    return this.http.get<ProduitParBoutique[]>(this.apiAdminUrl);
  }

  getMesProduits(): Observable<ProduitParBoutique[]> {
    return this.http.get<ProduitParBoutique[]>(`${this.apiUrl}/mes-produits`);
  }

  getProduitParBoutiqueById(id: string): Observable<ProduitParBoutique> {
    return this.http.get<ProduitParBoutique>(`${this.apiUrl}/${id}`);
  }

  createProduitParBoutique(produit: Partial<ProduitParBoutique>): Observable<ProduitParBoutique> {
    return this.http.post<ProduitParBoutique>(this.apiUrl, produit);
  }

  updateProduitParBoutique(id: string, produit: Partial<ProduitParBoutique>): Observable<ProduitParBoutique> {
    return this.http.put<ProduitParBoutique>(`${this.apiUrl}/${id}`, produit);
  }

  deleteProduitParBoutique(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStock(id: string, stock: number): Observable<ProduitParBoutique> {
    return this.http.patch<ProduitParBoutique>(`${this.apiUrl}/${id}/stock`, { stock });
  }

  /**
   * Ajoute une promotion avec gestion intelligente
   * Retourne le produit mis à jour et un message
   */
  ajouterPromotion(id: string, promotion: { remisePourcentage: number, dateDebut: string, dateFin: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/promotion`, promotion);
  }

  /**
   * Supprime la promotion active
   */
  supprimerPromotion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/promotion`);
  }

  /**
   * Récupère l'historique des promotions
   */
  getHistoriquePromotions(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/promotions`);
  }

  peutModifier(produit: ProduitParBoutique): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin') return false;
    if (user.role === 'boutique') {
      return produit.idBoutique === user._id;
    }
    return false;
  }
}