import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./promotion-list/promotion-list.component').then(m => m.PromotionListComponent),
    data: {
      title: 'Liste des promotions'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./promotion-form/promotion-form.component').then(m => m.PromotionFormComponent),
    data: {
      title: 'Nouvelle promotion'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./promotion-detail/promotion-detail.component').then(m => m.PromotionDetailComponent),
    data: {
      title: 'Détails promotion'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./promotion-form/promotion-form.component').then(m => m.PromotionFormComponent),
    data: {
      title: 'Modifier promotion'
    }
  }
];