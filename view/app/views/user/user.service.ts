import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, USERS_MOCK } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [...USERS_MOCK];

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: string): Observable<User | undefined> {
    const user = this.users.find(u => u._id === id);
    return of(user);
  }

  createUser(user: Partial<User>): Observable<User> {
    const newUser: User = {
      _id: (this.users.length + 1).toString(),
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      role: user.role || 'acheteur',
      photo: user.photo || 'assets/images/avatars/default.jpg',
      dateCreation: new Date(),
      actif: user.actif ?? true
    };
    this.users.push(newUser);
    return of(newUser);
  }

  updateUser(id: string, user: Partial<User>): Observable<User | undefined> {
    const index = this.users.findIndex(u => u._id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
      return of(this.users[index]);
    }
    return of(undefined);
  }

  deleteUser(id: string): Observable<void> {
    this.users = this.users.filter(u => u._id !== id);
    return of(void 0);
  }

  toggleActif(id: string): Observable<User | undefined> {
    const index = this.users.findIndex(u => u._id === id);
    if (index !== -1) {
      this.users[index].actif = !this.users[index].actif;
      return of(this.users[index]);
    }
    return of(undefined);
  }
}