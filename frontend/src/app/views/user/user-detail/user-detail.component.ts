import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  ListGroupModule  // Vérifiez que cet import est présent
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    ListGroupModule,  // Vérifiez que cette ligne est bien présente
    IconModule
  ]
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  profile: any = null;
  today: Date = new Date();
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    }
  }

  loadUser(id: string): void {
    console.log('📥 Chargement des détails utilisateur:', id);
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUserById(id).subscribe({
      next: (response) => {
        console.log('✅ Données reçues:', response);
        
        // Gérer la structure { user, profile } retournée par le backend
        const userData = response.user || response;
        this.profile = response.profile || null;
        
        if (userData) {
          console.log('📝 Utilisateur chargé:', userData);
          this.user = userData;
        } else {
          console.error('❌ Aucune donnée utilisateur');
          this.errorMessage = 'Utilisateur non trouvé';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement:', error);
        this.errorMessage = error.error?.msg || 'Erreur lors du chargement des données';
        this.isLoading = false;
      }
    });
  }

  getInitials(): string {
    if (!this.user) return 'U';
    return `${this.user.prenom[0]}${this.user.nom[0]}`;
  }

  getRoleBadgeColor(): string {
    if (!this.user) return 'secondary';
    switch(this.user.role) {
      case 'admin': return 'danger';
      case 'boutique': return 'warning';
      case 'acheteur': return 'success';
      default: return 'secondary';
    }
  }

  formatDate(date?: Date): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleActif(): void {
    if (!this.user) return;
    
    console.log('🔄 Changement du statut d\'activation pour:', this.user._id);
    console.log('   Ancien statut:', this.user.actif);
    
    this.userService.toggleActif(this.user._id).subscribe({
      next: (response) => {
        console.log('✅ Réponse reçue:', response);
        
        // Gérer la structure { msg, user } retournée par le backend
        const updatedUser = response.user || response;
        
        if (updatedUser) {
          console.log('✅ Statut changé avec succès:', updatedUser.actif);
          this.user = updatedUser;
          this.errorMessage = '';
        } else {
          console.error('❌ Pas de données utilisateur dans la réponse');
          this.errorMessage = 'Erreur: aucune donnée retournée';
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors du changement de statut:', error);
        this.errorMessage = error.error?.msg || 'Erreur lors du changement de statut';
      }
    });
  }
}