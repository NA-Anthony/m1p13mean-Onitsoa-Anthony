import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardAdminService {
  private apiUrl = 'https://m1p13mean-onitsoa-anthony.onrender.com/api/dashboard-admin';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les statistiques pour le dashboard admin
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  /**
   * Récupère le top 10 des boutiques
   */
  getTopBoutiques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-boutiques`);
  }

  /**
   * Récupère les 20 dernières commandes
   */
  getCommandesRecentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/commandes-recentes`);
  }

  /**
   * Récupère l'évolution des inscriptions et commandes
   */
  getEvolution(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/evolution`);
  }
}