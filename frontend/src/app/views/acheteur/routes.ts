import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./acheteur-list/acheteur-list.component').then(m => m.AcheteurListComponent),
    data: {
      title: 'Liste des acheteurs'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./acheteur-form/acheteur-form.component').then(m => m.AcheteurFormComponent),
    data: {
      title: 'Nouvel acheteur'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./acheteur-detail/acheteur-detail.component').then(m => m.AcheteurDetailComponent),
    data: {
      title: 'Détails acheteur'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./acheteur-form/acheteur-form.component').then(m => m.AcheteurFormComponent),
    data: {
      title: 'Modifier acheteur'
    }
  }
];