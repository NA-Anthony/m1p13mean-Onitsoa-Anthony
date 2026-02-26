import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./avis-list/avis-list.component').then(m => m.AvisListComponent),
    data: {
      title: 'Liste des avis'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./avis-form/avis-form.component').then(m => m.AvisFormComponent),
    data: {
      title: 'Nouvel avis'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./avis-detail/avis-detail.component').then(m => m.AvisDetailComponent),
    data: {
      title: 'Détails avis'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./avis-form/avis-form.component').then(m => m.AvisFormComponent),
    data: {
      title: 'Modifier avis'
    }
  }
];