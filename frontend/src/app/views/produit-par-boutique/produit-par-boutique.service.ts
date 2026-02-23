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

  /**
   * Récupère tous les produits par boutique (admin)
   */
  getAllProduitsParBoutique(): Observable<ProduitParBoutique[]> {
    return this.http.get<ProduitParBoutique[]>(this.apiAdminUrl);
  }

  /**
   * Récupère les produits de la boutique connectée
   */
  getMesProduits(): Observable<ProduitParBoutique[]> {
    return this.http.get<ProduitParBoutique[]>(`${this.apiUrl}/mes-produits`);
  }

  /**
   * Récupère un produit par ID
   */
  getProduitParBoutiqueById(id: string): Observable<ProduitParBoutique> {
    return this.http.get<ProduitParBoutique>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau produit dans la boutique (boutique only)
   */
  createProduitParBoutique(produit: Partial<ProduitParBoutique>): Observable<ProduitParBoutique> {
    return this.http.post<ProduitParBoutique>(this.apiUrl, produit);
  }

  /**
   * Met à jour un produit (boutique only)
   */
  updateProduitParBoutique(id: string, produit: Partial<ProduitParBoutique>): Observable<ProduitParBoutique> {
    return this.http.put<ProduitParBoutique>(`${this.apiUrl}/${id}`, produit);
  }

  /**
   * Supprime un produit (boutique only)
   */
  deleteProduitParBoutique(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Met à jour le stock (boutique only)
   */
  updateStock(id: string, stock: number): Observable<ProduitParBoutique> {
    return this.http.patch<ProduitParBoutique>(`${this.apiUrl}/${id}/stock`, { stock });
  }

  /**
   * Ajoute une promotion à un produit
   */
  ajouterPromotion(id: string, promotion: { remisePourcentage: number, dateDebut: string, dateFin: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/promotion`, promotion);
  }

  /**
   * Supprime la promotion d'un produit
   */
  supprimerPromotion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/promotion`);
  }

  /**
   * Vérifie si l'utilisateur peut modifier (boutique propriétaire)
   */
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