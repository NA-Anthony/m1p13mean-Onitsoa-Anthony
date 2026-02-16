import { Component } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  constructor() { }

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
    // simulate API call — replace with real auth service
    setTimeout(() => {
      this.loading = false;
      // demo: successful login when password === 'demo'
      if (pass === 'demo') {
        console.log('Connexion réussie', { user });
        // TODO: router navigate to dashboard
      } else {
        this.errorMessage = 'Identifiant ou mot de passe incorrect.';
      }
    }, 900);
  }

  socialSignIn(provider: string) {
    // placeholder for social auth
    console.log('Social sign-in:', provider);
    this.errorMessage = '';
  }

}
