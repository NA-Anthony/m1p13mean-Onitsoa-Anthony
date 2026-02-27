import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./produit-list/produit-list.component').then(m => m.ProduitListComponent),
    data: {
      title: 'Liste des produits'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./produit-form/produit-form.component').then(m => m.ProduitFormComponent),
    data: {
      title: 'Nouveau produit'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./produit-detail/produit-detail.component').then(m => m.ProduitDetailComponent),
    data: {
      title: 'Détails produit'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./produit-form/produit-form.component').then(m => m.ProduitFormComponent),
    data: {
      title: 'Modifier produit'
    }
  }
];