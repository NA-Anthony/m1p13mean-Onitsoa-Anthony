import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./commande-list/commande-list.component').then(m => m.CommandeListComponent),
    data: {
      title: 'Mes commandes'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./commande-detail/commande-detail.component').then(m => m.CommandeDetailComponent),
    data: {
      title: 'Détails commande'
    }
  }
];
