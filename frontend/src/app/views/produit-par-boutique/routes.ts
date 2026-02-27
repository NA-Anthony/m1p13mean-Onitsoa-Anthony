import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./produit-par-boutique-list/produit-par-boutique-list.component').then(m => m.ProduitParBoutiqueListComponent),
    data: {
      title: 'Produits par boutique'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./produit-par-boutique-form/produit-par-boutique-form.component').then(m => m.ProduitParBoutiqueFormComponent),
    data: {
      title: 'Nouveau produit en boutique'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./produit-par-boutique-detail/produit-par-boutique-detail.component').then(m => m.ProduitParBoutiqueDetailComponent),
    data: {
      title: 'Détails produit en boutique'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./produit-par-boutique-form/produit-par-boutique-form.component').then(m => m.ProduitParBoutiqueFormComponent),
    data: {
      title: 'Modifier produit en boutique'
    }
  }
];