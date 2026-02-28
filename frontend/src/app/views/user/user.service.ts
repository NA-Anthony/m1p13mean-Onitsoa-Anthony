import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://m1p13mean-onitsoa-anthony.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les utilisateurs depuis l'API
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Récupère un utilisateur par ID
   * Retourne { user, profile } selon le backend
   */
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouvel utilisateur
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Met à jour un utilisateur
   */
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Supprime un utilisateur
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Active/Désactive un utilisateur
   * Retourne { msg, user } selon le backend
   */
  toggleActif(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/toggle-actif`, {});
  }

  /**
   * Change le mot de passe d'un utilisateur
   */
  changePassword(id: string, passwords: { oldPassword: string; newPassword: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/password`, passwords);
  }

  /**
   * Récupère les statistiques des utilisateurs
   */
  getUserStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  /**
   * Récupère les utilisateurs par rôle
   */
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }
}