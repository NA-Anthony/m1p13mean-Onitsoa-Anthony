import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./livraison-list/livraison-list.component').then(m => m.LivraisonListComponent),
    data: {
      title: 'Liste des livraisons'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./livraison-form/livraison-form.component').then(m => m.LivraisonFormComponent),
    data: {
      title: 'Nouvelle livraison'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./livraison-detail/livraison-detail.component').then(m => m.LivraisonDetailComponent),
    data: {
      title: 'Détails livraison'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./livraison-form/livraison-form.component').then(m => m.LivraisonFormComponent),
    data: {
      title: 'Modifier livraison'
    }
  }
];