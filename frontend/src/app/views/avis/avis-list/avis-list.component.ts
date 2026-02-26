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
  ToastModule,
  SpinnerModule,
  AlertModule,
  ModalModule,
  PaginationModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AvisService } from '../../../services/avis.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-avis-list',
  templateUrl: './avis-list.component.html',
  styleUrls: ['./avis-list.component.scss'],
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
    ToastModule,
    SpinnerModule,
    AlertModule,
    ModalModule,
    PaginationModule,
    IconModule
  ]
})
export class AvisListComponent implements OnInit {
  avis: any[] = [];
  filteredAvis: any[] = [];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  
  // Filtres
  searchTerm: string = '';
  filterNote: string = '';
  filterReponse: string = 'tous';
  
  notes = [1, 2, 3, 4, 5];
  
  // États
  loading = true;
  error: string | null = null;
  
  // Pour le modal de suppression
  showDeleteModal = false;
  avisToDelete: any = null;
  
  // Pour les toasts
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';
  
  // Rôles
  isAdmin = false;
  isBoutique = false;
  isAcheteur = false;
  userId: string | null = null;

  constructor(
    private avisService: AvisService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    const role = user?.role;
    this.isAdmin = role === 'admin';
    this.isBoutique = role === 'boutique';
    this.isAcheteur = role === 'acheteur';
    this.userId = user?.id || user?._id;
  }

  ngOnInit(): void {
    this.loadAvis();
  }

  loadAvis(): void {
    this.loading = true;
    this.error = null;
    
    this.avisService.getAvis(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.avis = response.avis || [];
        this.filteredAvis = this.avis;
        this.totalItems = response.pagination?.total || 0;
        this.totalPages = response.pagination?.pages || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.msg || 'Erreur lors du chargement des avis';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterAvis(): void {
    this.filteredAvis = this.avis.filter(a => {
      const matchesSearch = this.searchTerm === '' || 
        a.commentaire?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.idProduitParBoutique?.idProduit?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.idAcheteur?.telephone?.includes(this.searchTerm);
      
      const matchesNote = this.filterNote === '' || a.note === parseInt(this.filterNote);
      
      const matchesReponse = this.filterReponse === 'tous' ||
        (this.filterReponse === 'avec' && a.reponseBoutique) ||
        (this.filterReponse === 'sans' && !a.reponseBoutique);
      
      return matchesSearch && matchesNote && matchesReponse;
    });
  }

  voirDetails(id: string): void {
    this.router.navigate(['/avis', id]);
  }

  editAvis(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/avis', id, 'edit']);
  }

  confirmDelete(avis: any, event: Event): void {
    event.stopPropagation();
    console.log('Avis à supprimer:', avis); // Debug
    console.log('ID utilisé:', avis._id || avis.id); // Debug
    this.avisToDelete = avis;
    this.showDeleteModal = true;
  }

  deleteAvis(): void {
    if (!this.avisToDelete) return;
    
    // Utiliser _id ou id selon la structure
    const avisId = this.avisToDelete._id || this.avisToDelete.id;
    
    if (!avisId) {
      this.showToastMessage('ID avis invalide', 'danger');
      this.showDeleteModal = false;
      return;
    }
    
    this.avisService.deleteAvis(avisId).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.avisToDelete = null;
        this.showToastMessage('Avis supprimé avec succès', 'success');
        this.loadAvis();
      },
      error: (err) => {
        this.showDeleteModal = false;
        this.showToastMessage(err.error?.msg || 'Erreur lors de la suppression', 'danger');
        console.error(err);
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadAvis();
  }

  getTotalAvis(): number {
    return this.totalItems;
  }

  getNoteMoyenneGlobale(): number {
    if (this.avis.length === 0) return 0;
    const sum = this.avis.reduce((acc, a) => acc + a.note, 0);
    return sum / this.avis.length;
  }

  getPourcentageNote(note: number): number {
    const count = this.avis.filter(a => a.note === note).length;
    if (this.avis.length === 0) return 0;
    return (count / this.avis.length) * 100;
  }

  getTauxReponse(): number {
    const avecReponse = this.avis.filter(a => a.reponseBoutique).length;
    if (this.avis.length === 0) return 0;
    return (avecReponse / this.avis.length) * 100;
  }

  getNoteEtoiles(note: number): number[] {
    return [1, 2, 3, 4, 5];
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  peutModifier(avis: any): boolean {
    if (this.isAdmin) return true;
    if (this.isAcheteur && avis.idAcheteur?.id === this.userId) return true;
    if (this.isAcheteur && avis.idAcheteur?._id === this.userId) return true;
    return false;
  }

  peutRepondre(avis: any): boolean {
    if (!this.isBoutique) return false;
    const boutiqueId = avis.idProduitParBoutique?.idBoutique?.id || 
                      avis.idProduitParBoutique?.idBoutique?._id;
    return boutiqueId === this.userId;
  }

  private showToastMessage(message: string, color: 'success' | 'danger'): void {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}