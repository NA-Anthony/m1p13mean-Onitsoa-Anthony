import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tarif-livraison-list/tarif-livraison-list.component').then(m => m.TarifLivraisonListComponent),
    data: {
      title: 'Liste des tarifs de livraison'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./tarif-livraison-form/tarif-livraison-form.component').then(m => m.TarifLivraisonFormComponent),
    data: {
      title: 'Nouveaux tarifs'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./tarif-livraison-detail/tarif-livraison-detail.component').then(m => m.TarifLivraisonDetailComponent),
    data: {
      title: 'Détails des tarifs'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./tarif-livraison-form/tarif-livraison-form.component').then(m => m.TarifLivraisonFormComponent),
    data: {
      title: 'Modifier les tarifs'
    }
  }
];