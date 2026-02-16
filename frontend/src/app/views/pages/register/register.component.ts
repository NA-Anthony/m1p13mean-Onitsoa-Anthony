import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgIf, RouterLink]
})
export class RegisterComponent {

  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedRole: 'shop' | 'buyer' | '' = '';
  fieldErrors: { username?: string; email?: string; password?: string; confirmPassword?: string; role?: string } = {};

  constructor() { }

  register(username: string | null, email: string | null, password: string | null, confirmPassword: string | null, role: string = '') {
    this.errorMessage = '';
    this.successMessage = '';
    this.fieldErrors = {};

    const user = (username || '').toString().trim();
    const mail = (email || '').toString().trim();
    const pass = (password || '').toString();
    const confirmPass = (confirmPassword || '').toString();
    const userRole = role.trim();

    // Validation role
    if (!userRole) {
      this.fieldErrors.role = 'Sélectionnez un type de compte';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }

    // Validation username
    if (!user) {
      this.fieldErrors.username = 'Nom d\'utilisateur requis';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }
    if (user.length < 3) {
      this.fieldErrors.username = 'Au minimum 3 caractères';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }

    // Validation email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail) {
      this.fieldErrors.email = 'Email requis';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }
    if (!emailPattern.test(mail)) {
      this.fieldErrors.email = 'Format d\'email invalide';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }

    // Validation password
    if (!pass) {
      this.fieldErrors.password = 'Mot de passe requis';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }
    if (pass.length < 6) {
      this.fieldErrors.password = 'Au minimum 6 caractères';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }

    // Validation confirm password
    if (!confirmPass) {
      this.fieldErrors.confirmPassword = 'Confirmation requise';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }
    if (pass !== confirmPass) {
      this.fieldErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      this.errorMessage = 'Veuillez corriger les champs.';
      return;
    }

    this.loading = true;
    // simulate API call
    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
      console.log('Registration successful', { user, mail, role: userRole });
      // TODO: redirect to login after success
    }, 1200);
  }

}
