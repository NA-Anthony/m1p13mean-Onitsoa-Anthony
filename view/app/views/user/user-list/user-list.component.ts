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

  roles = ['admin', 'boutique', 'acheteur'];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
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
        next: () => this.loadUsers()
      });
    }
  }

  toggleActif(id: string, event: Event): void {
    event.stopPropagation();
    this.userService.toggleActif(id).subscribe({
      next: () => this.loadUsers()
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