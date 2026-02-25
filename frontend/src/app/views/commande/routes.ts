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
    path: 'boutique',
    loadComponent: () => import('./commande-boutique-list/commande-boutique-list.component').then(m => m.CommandeBoutiqueListComponent),
    data: {
      title: 'Commandes reçues'
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
