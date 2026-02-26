export interface Horaire {
    ouverture: string;
    fermeture: string;
  }
  
  export interface Horaires {
    lundi: Horaire;
    mardi: Horaire;
    mercredi: Horaire;
    jeudi: Horaire;
    vendredi: Horaire;
    samedi: Horaire;
    dimanche: Horaire;
    [key: string]: Horaire;
  }
  
  export interface Boutique {
    _id: string;
    nomBoutique: string;
    description?: string;
    adresse?: string;
    telephone?: string;
    logo?: string;
    modePaiementAcceptes?: string[];
    horaires?: Horaires;
    noteMoyenne?: number;
    totalAvis?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export const BOUTIQUES_MOCK: Boutique[] = [
    {
      _id: '1',
      nomBoutique: 'Boutique Parisienne',
      description: 'La meilleure boutique de Paris avec des produits de qualité et un service client exceptionnel.',
      adresse: '123 Rue de Rivoli, 75001 Paris',
      telephone: '01 23 45 67 89',
      logo: 'assets/images/avatars/1.jpg',
      modePaiementAcceptes: ['Carte bancaire', 'Espèces', 'Paypal'],
      horaires: {
        lundi: { ouverture: '09:00', fermeture: '19:00' },
        mardi: { ouverture: '09:00', fermeture: '19:00' },
        mercredi: { ouverture: '09:00', fermeture: '19:00' },
        jeudi: { ouverture: '09:00', fermeture: '19:00' },
        vendredi: { ouverture: '09:00', fermeture: '20:00' },
        samedi: { ouverture: '10:00', fermeture: '18:00' },
        dimanche: { ouverture: '', fermeture: '' }
      },
      noteMoyenne: 4.5,
      totalAvis: 128
    },
    {
      _id: '2',
      nomBoutique: 'Shop Lyon',
      description: 'Boutique branchée au cœur de Lyon avec les dernières tendances.',
      adresse: '45 Rue de la République, 69002 Lyon',
      telephone: '04 78 90 12 34',
      logo: 'assets/images/avatars/2.jpg',
      modePaiementAcceptes: ['Carte bancaire', 'Apple Pay', 'Mobile Money'],
      horaires: {
        lundi: { ouverture: '10:00', fermeture: '19:00' },
        mardi: { ouverture: '10:00', fermeture: '19:00' },
        mercredi: { ouverture: '10:00', fermeture: '19:00' },
        jeudi: { ouverture: '10:00', fermeture: '19:00' },
        vendredi: { ouverture: '10:00', fermeture: '22:00' },
        samedi: { ouverture: '10:00', fermeture: '20:00' },
        dimanche: { ouverture: '14:00', fermeture: '18:00' }
      },
      noteMoyenne: 4.2,
      totalAvis: 89
    },
    {
      _id: '3',
      nomBoutique: 'Marseille Boutique',
      description: 'Artisanat et produits locaux de la région marseillaise.',
      adresse: '78 Rue Paradis, 13006 Marseille',
      telephone: '04 91 23 45 67',
      logo: 'assets/images/avatars/3.jpg',
      modePaiementAcceptes: ['Espèces', 'Mobile Money'],
      horaires: {
        lundi: { ouverture: '08:30', fermeture: '12:30' },
        mardi: { ouverture: '08:30', fermeture: '12:30' },
        mercredi: { ouverture: '08:30', fermeture: '12:30' },
        jeudi: { ouverture: '08:30', fermeture: '12:30' },
        vendredi: { ouverture: '08:30', fermeture: '12:30' },
        samedi: { ouverture: '09:00', fermeture: '12:00' },
        dimanche: { ouverture: '', fermeture: '' }
      },
      noteMoyenne: 4.8,
      totalAvis: 45
    }
  ];