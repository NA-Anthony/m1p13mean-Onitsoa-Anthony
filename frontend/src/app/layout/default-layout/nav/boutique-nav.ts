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
      name: 'Mes produits',
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
    }
];