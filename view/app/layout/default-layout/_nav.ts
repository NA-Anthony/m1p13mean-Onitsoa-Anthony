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
    iconComponent: { name: 'cil-building' },  // ← changé de cil-shop à cil-building
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
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Base',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Accordion',
        url: '/base/accordion',
        iconComponent: { name: 'cil-menu' }
      },
      {
        name: 'Breadcrumbs',
        url: '/base/breadcrumbs',
        iconComponent: { name: 'cil-arrow-thick-from-left' }
      },
      {
        name: 'Cards',
        url: '/base/cards',
        iconComponent: { name: 'cil-credit-card' }
      },
      {
        name: 'Carousel',
        url: '/base/carousel',
        iconComponent: { name: 'cil-film' }
      },
      {
        name: 'Collapse',
        url: '/base/collapse',
        iconComponent: { name: 'cil-chevron-circle-down-alt' }
      },
      {
        name: 'List Group',
        url: '/base/list-group',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Navs & Tabs',
        url: '/base/navs',
        iconComponent: { name: 'cil-tab' }
      },
      {
        name: 'Pagination',
        url: '/base/pagination',
        iconComponent: { name: 'cil-arrow-thick-to-right' }
      },
      {
        name: 'Placeholder',
        url: '/base/placeholder',
        iconComponent: { name: 'cil-view-module' }
      },
      {
        name: 'Popovers',
        url: '/base/popovers',
        iconComponent: { name: 'cil-comment-bubble' }
      },
      {
        name: 'Progress',
        url: '/base/progress',
        iconComponent: { name: 'cil-chart-line' }
      },
      {
        name: 'Spinners',
        url: '/base/spinners',
        iconComponent: { name: 'cil-reload' }
      },
      {
        name: 'Tables',
        url: '/base/tables',
        iconComponent: { name: 'cil-grid' }
      },
      {
        name: 'Tabs',
        url: '/base/tabs',
        iconComponent: { name: 'cil-tab' }
      },
      {
        name: 'Tooltips',
        url: '/base/tooltips',
        iconComponent: { name: 'cil-comment-square' }
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons',
        iconComponent: { name: 'cil-radio-checked' }
      },
      {
        name: 'Button groups',
        url: '/buttons/button-groups',
        iconComponent: { name: 'cil-group' }
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns',
        iconComponent: { name: 'cil-chevron-circle-down-alt' }
      }
    ]
  },
  {
    name: 'Forms',
    url: '/forms',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Form Control',
        url: '/forms/form-control',
        iconComponent: { name: 'cil-text' }
      },
      {
        name: 'Select',
        url: '/forms/select',
        iconComponent: { name: 'cil-list-rich' }
      },
      {
        name: 'Checks & Radios',
        url: '/forms/checks-radios',
        iconComponent: { name: 'cil-check' }
      },
      {
        name: 'Range',
        url: '/forms/range',
        iconComponent: { name: 'cil-equalizer' }
      },
      {
        name: 'Input Group',
        url: '/forms/input-group',
        iconComponent: { name: 'cil-group' }
      },
      {
        name: 'Floating Labels',
        url: '/forms/floating-labels',
        iconComponent: { name: 'cil-input' }
      },
      {
        name: 'Layout',
        url: '/forms/layout',
        iconComponent: { name: 'cil-layers' }
      },
      {
        name: 'Validation',
        url: '/forms/validation',
        iconComponent: { name: 'cil-check-circle' }
      }
    ]
  },
  {
    name: 'Charts',
    url: '/charts',
    iconComponent: { name: 'cil-chart-pie' }
  },
  {
    name: 'Icons',
    url: '/icons',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'CoreUI Free',
        url: '/icons/coreui-icons',
        iconComponent: { name: 'cil-star' },
        badge: {
          color: 'success',
          text: 'FREE'
        }
      },
      {
        name: 'CoreUI Flags',
        url: '/icons/flags',
        iconComponent: { name: 'cil-flag-alt' }
      },
      {
        name: 'CoreUI Brands',
        url: '/icons/brands',
        iconComponent: { name: 'cil-building' }
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        iconComponent: { name: 'cil-warning' }
      },
      {
        name: 'Badges',
        url: '/notifications/badges',
        iconComponent: { name: 'cil-tag' }
      },
      {
        name: 'Modal',
        url: '/notifications/modal',
        iconComponent: { name: 'cil-window' }
      },
      {
        name: 'Toast',
        url: '/notifications/toasts',
        iconComponent: { name: 'cil-toast' }
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/pages',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        iconComponent: { name: 'cil-account-logout' }
      },
      {
        name: 'Register',
        url: '/register',
        iconComponent: { name: 'cil-user-follow' }
      },
      {
        name: 'Error 404',
        url: '/404',
        iconComponent: { name: 'cil-warning' }
      },
      {
        name: 'Error 500',
        url: '/500',
        iconComponent: { name: 'cil-warning' }
      }
    ]
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