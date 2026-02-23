import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
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
    name: 'Dashboards',
    title: true
  },
  {
    name: 'Dashboard Admin',
    url: '/dashboard-admin',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'danger',
      text: 'ADMIN'
    }
  },
  {
    name: 'Dashboard Boutique',
    url: '/dashboard-boutique',
    iconComponent: { name: 'cil-building' },
    badge: {
      color: 'warning',
      text: 'BOUTIQUE'
    }
  },
  {
    name: 'Dashboard Acheteur',
    url: '/dashboard-acheteur',
    iconComponent: { name: 'cil-user' },
    badge: {
      color: 'success',
      text: 'ACHETEUR'
    }
  },
  {
    title: true,
    name: 'Boutiques'
  },
  {
    name: 'Gestion',
    url: '/boutiques',
    iconComponent: { name: 'cil-building' },
    children: [
      {
        name: 'Liste',
        url: '/boutiques',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Création',
        url: '/boutiques/nouvelle',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  },
  {
    title: true,
    name: 'Acheteurs'
  },
  {
    name: 'Gestion',
    url: '/acheteurs',
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'Liste',
        url: '/acheteurs',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Création',
        url: '/acheteurs/nouveau',
        iconComponent: { name: 'cil-user-plus' }
      }
    ]
  },
  {
    title: true,
    name: 'Utilisateurs'
  },
  {
    name: 'Gestion des utilisateurs',
    url: '/users',
    iconComponent: { name: 'cil-people' },
    children: [
      {
        name: 'Liste des utilisateurs',
        url: '/users',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Nouvel utilisateur',
        url: '/users/nouveau',
        iconComponent: { name: 'cil-user-plus' }
      }
    ]
  },
  {
    title: true,
    name: 'Catalogue'
  },
  {
    name: 'Produits',
    url: '/produits',
    iconComponent: { name: 'cil-basket' },
    children: [
      {
        name: 'Liste des produits',
        url: '/produits',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Nouveau produit',
        url: '/produits/nouveau',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  },
  {
    name: 'Produits par boutique',
    url: '/produits-par-boutique',
    iconComponent: { name: 'cil-building' },
    children: [
      {
        name: 'Liste des produits',
        url: '/produits-par-boutique',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Ajouter',
        url: '/produits-par-boutique/nouveau',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  },
  {
    name: 'Promotions',
    url: '/promotions',
    iconComponent: { name: 'cil-tags' },
    children: [
      {
        name: 'Liste des promotions',
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
    name: 'Commandes',
    url: '/commandes',
    iconComponent: { name: 'cil-cart' },
    children: [
      {
        name: 'Liste des commandes',
        url: '/commandes',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Nouvelle commande',
        url: '/commandes/nouveau',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  },
  {
    name: 'Avis',
    url: '/avis',
    iconComponent: { name: 'cil-comment-square' },
    children: [
      {
        name: 'Liste des avis',
        url: '/avis',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Nouvel avis',
        url: '/avis/nouveau',
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
        name: 'Liste des livraisons',
        url: '/livraisons',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Nouvelle livraison',
        url: '/livraisons/nouveau',
        iconComponent: { name: 'cil-plus' }
      }
    ]
  },
  {
    name: 'Tarifs livraison',
    url: '/tarifs-livraison',
    iconComponent: { name: 'cil-map' },
    children: [
      {
        name: 'Liste des tarifs',
        url: '/tarifs-livraison',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Nouveaux tarifs',
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
  }
];