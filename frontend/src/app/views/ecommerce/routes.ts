import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalogue',
    pathMatch: 'full'
  },
  {
    path: 'catalogue',
    loadComponent: () => import('./boutiques-catalogue/boutiques-catalogue.component').then(m => m.BoutiquesCatalogueComponent),
    data: {
      title: 'Catalogue'
    }
  },
  {
    path: 'catalogue/:boutiqueId',
    loadComponent: () => import('./catalogue/catalogue.component').then(m => m.CatalogueComponent),
    data: {
      title: 'Produits de la boutique'
    }
  },
  {
    path: 'panier',
    loadComponent: () => import('./panier/panier.component').then(m => m.PanierComponent),
    data: {
      title: 'Mon panier'
    }
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
    data: {
      title: 'Finaliser la commande'
    }
  },
  {
    path: 'commande-confirmee/:id',
    loadComponent: () => import('./commande-confirmee/commande-confirmee.component').then(m => m.CommandeConfirmeeComponent),
    data: {
      title: 'Commande confirmée'
    }
  }
];