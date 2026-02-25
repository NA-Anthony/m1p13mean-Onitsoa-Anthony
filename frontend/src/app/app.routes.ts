import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 🔓 Routes publiques (SANS layout et SANS guard)
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Login Page' }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: { title: 'Register Page' }
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: { title: 'Page 404' }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: { title: 'Page 500' }
  },
  
  // Redirect par défaut (APRÈS les routes publiques)
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  
  // 🔒 Routes protégées (AVEC layout et guard)
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],  // ← Guard ajouté
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      },
      // {
      //   path: 'dashboard-admin',
      //   loadComponent: () => import('./views/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent),
      //   data: {
      //     title: 'Dashboard Admin'
      //   }
      // },
      {
        path: 'dashboard-boutique',
        loadComponent: () => import('./views/dashboard-boutique/dashboard-boutique.component').then(m => m.DashboardBoutiqueComponent),
        data: {
          title: 'Dashboard Boutique'
        }
      },
      {
        path: 'dashboard-acheteur',
        loadComponent: () => import('./views/dashboard-acheteur/dashboard-acheteur.component').then(m => m.DashboardAcheteurComponent),
        data: {
          title: 'Dashboard Acheteur'
        }
      },
      {
        path: 'boutiques',
        loadChildren: () => import('./views/boutique/routes').then((m) => m.routes)
      },
      // {
      //   path: 'acheteurs',
      //   loadChildren: () => import('./views/acheteur/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'users',
      //   loadChildren: () => import('./views/user/routes').then((m) => m.routes)
      // },
      {
        path: 'produits',
        loadChildren: () => import('./views/produit/routes').then((m) => m.routes)
      },
      {
        path: 'produits-par-boutique',
        loadChildren: () => import('./views/produit-par-boutique/routes').then((m) => m.routes)
      },
      {
        path: 'ecommerce',
        loadChildren: () => import('./views/ecommerce/routes').then((m) => m.routes)
      },
      // {
      //   path: 'promotions',
      //   loadChildren: () => import('./views/promotion/routes').then((m) => m.routes)
      // },
      {
        path: 'commandes',
        loadChildren: () => import('./views/commande/routes').then((m) => m.routes)
      },
      // {
      //   path: 'avis',
      //   loadChildren: () => import('./views/avis/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'livraisons',
      //   loadChildren: () => import('./views/livraison/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'tarifs-livraison',
      //   loadChildren: () => import('./views/tarif-livraison/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'ecommerce',
      //   loadChildren: () => import('./views/ecommerce/routes').then((m) => m.routes)
      // }
    ]
  },
  
  // Route par défaut - catch all (DOIT être en dernier)
  { path: '**', redirectTo: '404' }
];
