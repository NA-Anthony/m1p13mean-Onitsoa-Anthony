import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  TableModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    TableModule,
    ProgressModule,
    IconModule
  ]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  filterRole: string = '';
  filterActif: string = 'tous';
  isLoading: boolean = false;
  errorMessage: string = '';

  roles = ['admin', 'boutique', 'acheteur'];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = this.searchTerm === '' || 
        user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.filterRole === '' || user.role === this.filterRole;
      
      const matchesActif = this.filterActif === 'tous' || 
        (this.filterActif === 'actif' && user.actif) ||
        (this.filterActif === 'inactif' && !user.actif);
      
      return matchesSearch && matchesRole && matchesActif;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/users', id]);
  }

  deleteUser(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          alert('Erreur lors de la suppression de l\'utilisateur');
        }
      });
    }
  }

  toggleActif(id: string, event: Event): void {
    event.stopPropagation();
    
    console.log('🔄 Toggle actif pour utilisateur:', id);
    
    this.userService.toggleActif(id).subscribe({
      next: (response) => {
        console.log('✅ Réponse reçue:', response);
        
        // Gérer la structure { msg, user } retournée par le backend
        const updatedUser = response.user || response;
        
        if (updatedUser && updatedUser._id) {
          console.log('✅ Utilisateur mis à jour, nouveau statut:', updatedUser.actif);
          
          // Mettre à jour l'utilisateur dans la liste
          const index = this.users.findIndex(u => u._id === id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            console.log('✅ Utilisateur mis à jour dans la liste');
            this.filterUsers();
          }
        } else {
          console.error('❌ Pas de données utilisateur dans la réponse');
          this.loadUsers(); // Recharger si pas de données
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors du changement de statut:', error);
        this.errorMessage = error.error?.msg || 'Erreur lors du changement de statut';
        alert(this.errorMessage);
      }
    });
  }

  getTotalActifs(): number {
    return this.users.filter(u => u.actif).length;
  }

  getTotalByRole(role: string): number {
    return this.users.filter(u => u.role === role).length;
  }

  getInitials(user: User): string {
    return `${user.prenom[0]}${user.nom[0]}`;
  }

  getRoleBadgeColor(role: string): string {
    switch(role) {
      case 'admin': return 'danger';
      case 'boutique': return 'warning';
      case 'acheteur': return 'success';
      default: return 'secondary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}