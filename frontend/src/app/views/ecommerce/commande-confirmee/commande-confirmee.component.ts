import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  ButtonModule,
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommandeService } from '../../commande/commande.service';

@Component({
  selector: 'app-commande-confirmee',
  templateUrl: './commande-confirmee.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    ButtonModule,
    BadgeModule,
    IconModule
  ]
})
export class CommandeConfirmeeComponent implements OnInit {
  commande: any = null;
  commandeId: string = '';

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.commandeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCommande();
  }

  loadCommande(): void {
    this.commandeService.getCommandeById(this.commandeId).subscribe({
      next: (data) => this.commande = data
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}