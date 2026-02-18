import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgIf,
    RouterLink,
  ],
})
export class RegisterComponent {
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedRole: 'boutique' | 'acheteur' | '' = '';
  fieldErrors: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(
    username: string | null,
    email: string | null,
    password: string | null,
    confirmPassword: string | null,
    role: string = '',
  ) {
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
      // this.fieldErrors.role =
      //   'Veuillez sélectionner un type de compte (Boutique ou Acheteur)';
      this.errorMessage = 'Erreur: Type de compte manquant';
      return;
    }

    // Validation username
    if (!user) {
      this.fieldErrors.username = "Entrez votre nom d'utilisateur";
      this.errorMessage = "Erreur: Nom d'utilisateur manquant";
      return;
    }
    if (user.length < 3) {
      this.fieldErrors.username = `Au minimum 3 caractères (actuellement: ${user.length})`;
      this.errorMessage = "Erreur: Nom d'utilisateur trop court";
      return;
    }

    // Validation email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail) {
      this.fieldErrors.email = 'Entrez une adresse email valide';
      this.errorMessage = 'Erreur: Email manquant';
      return;
    }
    if (!emailPattern.test(mail)) {
      this.fieldErrors.email =
        'Format invalide. Exemple: utilisateur@domaine.com';
      this.errorMessage = "Erreur: Format d'email incorrect";
      return;
    }

    // Validation password
    if (!pass) {
      this.fieldErrors.password = 'Créez un mot de passe sécurisé';
      this.errorMessage = 'Erreur: Mot de passe manquant';
      return;
    }
    if (pass.length < 6) {
      this.fieldErrors.password = `Au minimum 6 caractères (actuellement: ${pass.length})`;
      this.errorMessage = 'Erreur: Mot de passe trop court';
      return;
    }

    // Validation confirm password
    if (!confirmPass) {
      this.fieldErrors.confirmPassword = 'Confirmez votre mot de passe';
      this.errorMessage = 'Erreur: Confirmation de mot de passe manquante';
      return;
    }
    if (pass !== confirmPass) {
      this.fieldErrors.confirmPassword =
        'Les mots de passe ne correspondent pas';
      this.errorMessage = 'Erreur: Les mots de passe sont différents';
      return;
    }

    this.loading = true;

    // Prepare validation data based on role
    const payload: any = {
      nom: username,
      prenom: username, // For simplicity using username as both first/last name initially
      email: mail,
      password: pass,
      role: userRole === 'shop' ? 'boutique' : 'acheteur',
    };

    if (userRole === 'shop') {
      payload.nomBoutique = username + ' Shop'; // Default shop name
    }

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage =
          'Inscription réussie ! Redirection vers le tableau de bord...';
        // console.log('Registration successful', response);

        // Redirection automatique au dashboard (l'utilisateur est déjà authentifié)
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Registration error', err);

        // Messages d'erreur plus clairs selon le type d'erreur
        if (err.error?.msg?.includes('email')) {
          this.errorMessage =
            'Cet email est déjà utilisé. Connectez-vous ou utilisez une autre adresse.';
        } else if (err.error?.msg?.includes('mot de passe')) {
          this.errorMessage =
            "Erreur avec le mot de passe. Assurez-vous qu'il est sécurisé.";
        } else if (err.status === 400) {
          this.errorMessage =
            err.error?.msg || 'Erreur: Les données saisies sont invalides.';
        } else if (err.status === 500) {
          this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage =
            err.error?.msg ||
            "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
        }
      },
    });
  }
}
