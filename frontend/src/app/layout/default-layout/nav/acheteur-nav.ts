import { INavData } from '@coreui/angular';

export const acheteurNavItems: INavData[] = [
  {
    title: true,
    name: 'Mon Espace'
  },
  {
    name: 'Dashboard',
    url: '/dashboard-acheteur',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'success',
      text: 'ACHETEUR'
    }
  },
  {
    name: 'E-commerce',
    url: '/ecommerce',
    iconComponent: { name: 'cil-basket' },
    children: [
      {
        name: 'Catalogue',
        url: '/ecommerce/catalogue',
        iconComponent: { name: 'cil-grid' }
      },
      {
        name: 'Mon panier',
        url: '/ecommerce/panier',
        iconComponent: { name: 'cil-cart' }
      },
      {
        name: 'Mon Portefeuille',
        url: '/ecommerce/portefeuille',
        iconComponent: { name: 'cil-wallet' }
      }
    ]
  },
  {
    name: 'Mes Commandes',
    url: '/commandes',
    iconComponent: { name: 'cil-cart' }
  },
  {
    name: 'Mes Avis',
    url: '/avis',
    iconComponent: { name: 'cil-comment-square' },
    children: [
      {
        name: 'Mes avis',
        url: '/avis',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Donner un avis',
        url: '/avis/nouveau',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  }
];