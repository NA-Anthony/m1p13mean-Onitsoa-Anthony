import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Charge l'utilisateur depuis le localStorage au démarrage
   */
  private loadUserFromStorage(): void {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        console.error('Erreur parsing user', e);
        this.logout();
      }
    }
  }

  /**
   * Inscription utilisateur
   */
  register(userData: any): Observable<{ token: string; user: any }> {
    return this.http
      .post<{ token: string; user: any }>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
        }),
      );
  }

  /**
   * Connexion utilisateur
   */
  login(credentials: any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.http
      .post<{ token: string; user: any }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
          this.isLoadingSubject.next(false);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          throw error;
        }),
      );
  }

  /**
   * Récupère les données de l'utilisateur connecté depuis le serveur
   */
  getMe(): Observable<{ user: any; profil?: any }> {
    return this.http.get<{ user: any; profil?: any }>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        if (response && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      }),
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    // console.log('🚪 Déconnexion en cours...');
    
    // Supprimer les données de stockage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Mettre à jour le state
    this.currentUserSubject.next(null);
    this.isLoadingSubject.next(false);
    
    console.log('✅ Données supprimées du localStorage');
    console.log('   - token:', this.getToken());
    console.log('   - user:', this.getCurrentUser());
    
    // Rediriger vers login
    console.log('🔄 Redirection vers /login');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  /**
   * Récupère le token JWT
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupère l'utilisateur courant
   */
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === role;
  }

  /**
   * Gère les données de réponse d'authentification
   */
  private handleAuthResponse(response: { token: string; user: any }): void {
    if (response && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
  }
}
