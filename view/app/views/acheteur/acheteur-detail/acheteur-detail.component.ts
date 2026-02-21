import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  AvatarModule,
  ButtonModule,
  BadgeModule,
  ListGroupModule  // ← Vérifiez que c'est bien ListGroupModule (pas ListModule)
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AcheteurService } from '../acheteur.service';
import { Acheteur } from '../acheteur.model';

@Component({
  selector: 'app-acheteur-detail',
  templateUrl: './acheteur-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    ListGroupModule,  // ← Vérifiez que cette ligne est bien présente
    IconModule
  ]
})
export class AcheteurDetailComponent implements OnInit {
  acheteur: Acheteur | null = null;

  constructor(
    private route: ActivatedRoute,
    private acheteurService: AcheteurService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.acheteurService.getAcheteurById(id).subscribe({
        next: (data) => this.acheteur = data || null
      });
    }
  }

  getInitials(): string {
    if (!this.acheteur) return 'A';
    return `A${this.acheteur._id}`;
  }

  getAvatarColor(): string {
    if (!this.acheteur) return 'primary';
    const colors = ['primary', 'success', 'info', 'warning', 'danger'];
    const index = parseInt(this.acheteur._id) % colors.length;
    return colors[index];
  }

  formatDate(date?: Date): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}