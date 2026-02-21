export interface User {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    password?: string;
    role: 'admin' | 'boutique' | 'acheteur';
    photo: string;
    dateCreation: Date;
    actif: boolean;
  }
  
  export const USERS_MOCK: User[] = [
    {
      _id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      role: 'admin',
      photo: 'assets/images/avatars/1.jpg',
      dateCreation: new Date('2024-01-15'),
      actif: true
    },
    {
      _id: '2',
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@email.com',
      role: 'boutique',
      photo: 'assets/images/avatars/2.jpg',
      dateCreation: new Date('2024-02-20'),
      actif: true
    },
    {
      _id: '3',
      nom: 'Lefebvre',
      prenom: 'Pierre',
      email: 'pierre.lefebvre@email.com',
      role: 'acheteur',
      photo: 'assets/images/avatars/3.jpg',
      dateCreation: new Date('2024-03-10'),
      actif: false
    }
  ];
  
  export const ROLES = ['admin', 'boutique', 'acheteur'];