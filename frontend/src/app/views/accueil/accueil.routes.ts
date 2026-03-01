import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./accueil.component').then(m => m.AccueilComponent),
    data: {
      title: 'Accueil'
    }
  }
];