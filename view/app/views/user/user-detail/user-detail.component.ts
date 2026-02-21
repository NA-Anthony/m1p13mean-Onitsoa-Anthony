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
  today: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (data) => this.user = data || null
      });
    }
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
    if (this.user) {
      this.userService.toggleActif(this.user._id).subscribe({
        next: (updated) => {
          if (updated) this.user = updated;
        }
      });
    }
  }
}