import { INavData } from '@coreui/angular';

export const boutiqueNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Ma Boutique'
  },
  {
    name: 'Dashboard Boutique',
    url: '/dashboard-boutique',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'warning',
      text: 'BOUTIQUE'
    }
  },
  {
    title: true,
    name: 'Gestion'
  },
  {
    name: 'Mon Profil',
    url: '/boutiques/mon-profil',
    iconComponent: { name: 'cil-building' }
  },
  {
    name: 'Mes Produits',
    url: '/produits-par-boutique',
    iconComponent: { name: 'cil-basket' },
    children: [
      {
        name: 'Liste des produits',
        url: '/produits-par-boutique',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Ajouter un produit',
        url: '/produits-par-boutique/nouveau',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  },
  {
    name: 'Mes Commandes',
    url: '/commandes',
    iconComponent: { name: 'cil-cart' },
    children: [
      {
        name: 'Commandes reçues',
        url: '/commandes',
        iconComponent: { name: 'cil-list' }
      }
    ]
  },
  {
    name: 'Avis clients',
    url: '/avis',
    iconComponent: { name: 'cil-comment-square' },
    children: [
      {
        name: 'Liste des avis',
        url: '/avis',
        iconComponent: { name: 'cil-list' }
      }
    ]
  },
  {
    name: 'Promotions',
    url: '/promotions',
    iconComponent: { name: 'cil-tags' },
    children: [
      {
        name: 'Mes promotions',
        url: '/promotions',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Nouvelle promotion',
        url: '/promotions/nouveau',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  },
  {
    name: 'Livraisons',
    url: '/livraisons',
    iconComponent: { name: 'cil-truck' },
    children: [
      {
        name: 'Mes livraisons',
        url: '/livraisons',
        iconComponent: { name: 'cil-list' }
      }
    ]
  },
  {
    name: 'Tarifs livraison',
    url: '/tarifs-livraison',
    iconComponent: { name: 'cil-map' },
    children: [
      {
        name: 'Mes tarifs',
        url: '/tarifs-livraison',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Configurer',
        url: '/tarifs-livraison/nouveau',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  },
  {
    title: true,
    name: 'E-commerce'
  },
  {
    name: 'Boutique en ligne',
    url: '/ecommerce',
    iconComponent: { name: 'cil-basket' },
    children: [
      {
        name: 'Catalogue',
        url: '/ecommerce/catalogue',
        iconComponent: { name: 'cil-grid' }
      },
      {
        name: 'Panier',
        url: '/ecommerce/panier',
        iconComponent: { name: 'cil-cart' }
      }
    ]
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    iconComponent: { name: 'cil-pencil' }
  },
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Base',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' }
  },
  {
    name: 'Buttons',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' }
  },
  {
    name: 'Forms',
    url: '/forms',
    iconComponent: { name: 'cil-notes' }
  },
  {
    name: 'Icons',
    url: '/icons',
    iconComponent: { name: 'cil-star' }
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/5.x/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];