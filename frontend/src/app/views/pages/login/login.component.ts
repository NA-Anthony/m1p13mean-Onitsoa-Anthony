import { Component } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, NgIf, RouterLink]
})
export class LoginComponent {

  loading = false;
  errorMessage = '';
  fieldErrors: { email?: string; password?: string } = {};
  
  // Propriété pour le toggle du mot de passe
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  // Méthode pour toggler l'affichage du mot de passe
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(username: string | null, password: string | null) {
    this.errorMessage = '';
    this.fieldErrors = {};
    const user = (username || '').toString().trim();
    const pass = (password || '').toString();
    if (!user) {
      this.fieldErrors.email = 'Identifiant requis';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }
    // basic email pattern check (accepts simple ids too)
    const emailLike = /@/.test(user);
    if (emailLike) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(user)) {
        this.fieldErrors.email = 'Format d\'email invalide';
        this.errorMessage = 'Veuillez corriger les champs.';
        return;
      }
    }
    if (!pass) {
      this.fieldErrors.password = 'Mot de passe requis';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }

    this.loading = true;
    this.loading = true;

    this.authService.login({ email: user, password: pass }).subscribe({
      next: (response) => {
        this.loading = false;
        const userRole = response.user?.role;
        console.log('Connexion réussie', userRole);
        if (userRole === 'boutique') {
          this.router.navigate(['/dashboard-boutique']);
        } 
        // else if (userRole === 'admin') {
        //   this.router.navigate(['/dashboard-admin']);
        // } 
        else if (userRole === 'acheteur') {
          this.router.navigate(['/dashboard-acheteur']);
        } 
        else {
          // Redirection par défaut si le rôle n'est pas reconnu
          this.router.navigate(['/dashboard-admin']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error', err);
        this.errorMessage = err.error?.msg || 'Identifiant ou mot de passe incorrect.';
      }
    });

  }

  socialSignIn(provider: string) {
    // placeholder for social auth
    console.log('Social sign-in:', provider);
    this.errorMessage = '';
  }

}