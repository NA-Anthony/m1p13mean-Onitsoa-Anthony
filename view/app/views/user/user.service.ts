import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, USERS_MOCK } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Obtenir tous les utilisateurs
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erreur lors de la récupération des utilisateurs', error);
        console.error('🔍 Assurez-vous que le backend est démarré sur port 3000');
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtenir un utilisateur par ID
   */
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ Erreur lors de la récupération de l'utilisateur ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Créer un nouvel utilisateur
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.baseUrl, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erreur lors de la création de l\'utilisateur', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Modifier un utilisateur
   */
  updateUser(id: string, user: Partial<User>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ Erreur lors de la modification de l'utilisateur ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Supprimer un utilisateur
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ Erreur lors de la suppression de l'utilisateur ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Activer/Désactiver un utilisateur
   */
  toggleActif(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/toggle-actif`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ Erreur lors du changement d'état de l'utilisateur ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Changer le mot de passe d'un utilisateur
   */
  changePassword(id: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/password`, { newPassword }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ Erreur lors du changement de mot de passe`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtenir les utilisateurs par rôle
   */
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/role/${role}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ Erreur lors de la récupération des utilisateurs avec le rôle ${role}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtenir les statistiques utilisateur
   */
  getUserStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Erreur lors de la récupération des statistiques', error);
        return throwError(() => error);
      })
    );
  }
}
