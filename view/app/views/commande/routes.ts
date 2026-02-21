import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./commande-list/commande-list.component').then(m => m.CommandeListComponent),
    data: {
      title: 'Liste des commandes'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./commande-form/commande-form.component').then(m => m.CommandeFormComponent),
    data: {
      title: 'Nouvelle commande'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./commande-detail/commande-detail.component').then(m => m.CommandeDetailComponent),
    data: {
      title: 'Détails commande'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./commande-form/commande-form.component').then(m => m.CommandeFormComponent),
    data: {
      title: 'Modifier commande'
    }
  }
];