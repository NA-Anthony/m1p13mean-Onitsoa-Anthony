import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // À ajuster selon votre backend

  constructor(private http: HttpClient) {}

  // Users
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  // Boutiques
  getBoutiques(): Observable<any> {
    return this.http.get(`${this.baseUrl}/boutiques`);
  }

  getBoutique(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/boutiques/${id}`);
  }

  createBoutique(boutique: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/boutiques`, boutique);
  }

  updateBoutique(id: string, boutique: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/boutiques/${id}`, boutique);
  }

  deleteBoutique(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/boutiques/${id}`);
  }

  // Produits
  getProduits(): Observable<any> {
    return this.http.get(`${this.baseUrl}/produits`);
  }

  getProduit(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/produits/${id}`);
  }

  createProduit(produit: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/produits`, produit);
  }

  updateProduit(id: string, produit: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/produits/${id}`, produit);
  }

  deleteProduit(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/produits/${id}`);
  }

  // Commandes
  getCommandes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/commandes`);
  }

  getCommande(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/commandes/${id}`);
  }

  updateCommandeStatut(id: string, statut: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/commandes/${id}/statut`, { statut });
  }

  // Statistiques pour dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/stats`);
  }

  getCommandesParMois(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/commandes-par-mois`);
  }

  getTopBoutiques(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/top-boutiques`);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
}