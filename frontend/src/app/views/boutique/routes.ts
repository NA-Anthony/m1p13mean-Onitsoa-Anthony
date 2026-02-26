import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./boutique-list/boutique-list.component').then(m => m.BoutiqueListComponent),
    data: {
      title: 'Liste des boutiques'
    }
  },
  {
    path: 'nouvelle',
    loadComponent: () => import('./boutique-form/boutique-form.component').then(m => m.BoutiqueFormComponent),
    data: {
      title: 'Nouvelle boutique'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./boutique-detail/boutique-detail.component').then(m => m.BoutiqueDetailComponent),
    data: {
      title: 'Détails boutique'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./boutique-form/boutique-form.component').then(m => m.BoutiqueFormComponent),
    data: {
      title: 'Modifier boutique'
    }
  }
];