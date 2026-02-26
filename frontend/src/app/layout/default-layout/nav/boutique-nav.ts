import { INavData } from '@coreui/angular';

export const boutiqueNavItems: INavData[] = [
    {
        name: 'Dashboard',
        url: '/dashboard-boutique',
        iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'warning',
          text: 'BOUTIQUE'
        }
    },
    {
        name: 'Profil',
        url: '/profil',
        iconComponent: { name: 'cil-user' },
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
    ,
    {
      name: 'Commandes',
      url: '/commandes/boutique',
      iconComponent: { name: 'cil-list-rich' },
      children: [
        {
          name: 'Commandes reçues',
          url: '/commandes/boutique',
          iconComponent: { name: 'cil-list' }
        }
      ]
    }
];