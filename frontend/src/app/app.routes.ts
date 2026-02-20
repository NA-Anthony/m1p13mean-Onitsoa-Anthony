import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { CustomerLayoutComponent } from './layout/customer-layout';
import { CustomerHomeComponent } from './views/customer/home/customer-home.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Routes pour les acheteurs (layout e-commerce)
  {
    path: '',
    component: CustomerLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'eBossy - Accueil',
      roles: ['acheteur'],
    },
    children: [
      {
        path: 'home',
        component: CustomerHomeComponent,
        data: { title: 'Accueil' },
      },
      {
        path: 'shop',
        loadComponent: () =>
          import('./views/customer/shop/customer-shop.component').then(
            (m) => m.CustomerShopComponent,
          ),
        data: { title: 'Boutiques' },
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./views/customer/products/customer-products.component').then(
            (m) => m.CustomerProductsComponent,
          ),
        data: { title: 'Tous les Produits' },
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./views/customer/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent,
          ),
        data: { title: 'Détail du Produit' },
      },
      {
        path: 'deals',
        loadComponent: () =>
          import('./views/customer/deals/customer-deals.component').then(
            (m) => m.CustomerDealsComponent,
          ),
        data: { title: 'Promotions' },
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./views/customer/cart/customer-cart.component').then(
            (m) => m.CustomerCartComponent,
          ),
        data: { title: 'Panier' },
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./views/customer/account/customer-account.component').then(
            (m) => m.CustomerAccountComponent,
          ),
        data: { title: 'Mon Compte' },
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./views/customer/orders/customer-orders.component').then(
            (m) => m.CustomerOrdersComponent,
          ),
        data: { title: 'Mes Commandes' },
      },
    ],
  },
  {
    path: 'admin',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Admin Dashboard',
      roles: ['admin', 'boutique'],
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/routes').then((m) => m.routes),
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes),
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/routes').then((m) => m.routes),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/routes').then((m) => m.routes),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/routes').then((m) => m.routes),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/routes').then((m) => m.routes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/routes').then((m) => m.routes),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/routes').then((m) => m.routes),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component,
      ),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component,
      ),
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: 'login' },
];
