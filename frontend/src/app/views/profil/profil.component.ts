import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CardModule, GridModule, ButtonModule, FormModule, 
  AvatarModule, SpinnerModule, AlertModule, BadgeModule 
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, GridModule, 
    ButtonModule, FormModule, AvatarModule, IconModule,
    SpinnerModule, AlertModule, BadgeModule
  ]
})
export class ProfilComponent implements OnInit {
  userData: any = null;
  profilData: any = null;
  loading = true;
  submitting = false;
  message: { type: string, text: string } | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.authService.getMe().subscribe({
      next: (res) => {
        this.userData = { ...res.user };
        this.profilData = { ...res.profil };
        this.loading = false;
      },
      error: () => {
        this.message = { type: 'danger', text: 'Erreur de chargement du profil' };
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitting = true;
    const payload = {
      nom: this.userData.nom,
      prenom: this.userData.prenom,
      telephone: this.profilData.telephone,
      adresse: this.profilData.adresseLivraisonParDefaut
    };

    this.authService.updateProfil(payload).subscribe({
      next: () => {
        this.message = { type: 'success', text: 'Profil mis à jour avec succès !' };
        this.submitting = false;
      },
      error: () => {
        this.message = { type: 'danger', text: 'Échec de la mise à jour.' };
        this.submitting = false;
      }
    });
  }
}