import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] = [
    {
        name: 'Dashboard',
        url: '/dashboard-admin',
        iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'Admin'
        }
    },
    {
        title: true,
        name: 'Boutiques'
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
        name: 'Liste des boutiques',
        url: '/boutiques',
        iconComponent: { name: 'cil-building' }
    },
    {
        name: 'Produits par boutique',
        url: '/produits-par-boutique',
        iconComponent: { name: 'cil-cart' }
    }
];