import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent),
    data: {
      title: 'Liste des utilisateurs'
    }
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent),
    data: {
      title: 'Nouvel utilisateur'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./user-detail/user-detail.component').then(m => m.UserDetailComponent),
    data: {
      title: 'Détails utilisateur'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent),
    data: {
      title: 'Modifier utilisateur'
    }
  }
];