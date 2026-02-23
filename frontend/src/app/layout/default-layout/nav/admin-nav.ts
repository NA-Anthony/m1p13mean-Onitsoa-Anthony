import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] = [
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
      url: '/produits-par-boutique/produits-par-boutique',
      iconComponent: { name: 'cil-building' }
    }
];