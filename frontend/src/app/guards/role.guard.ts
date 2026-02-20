import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const currentUser = this.authService.getCurrentUser();
    const requiredRoles = route.data['roles'] as string[];

    if (!currentUser || !requiredRoles) {
      return true;
    }

    // Vérifier si l'utilisateur a l'un des rôles requis
    if (requiredRoles.includes(currentUser.role)) {
      return true;
    }

    // Rediriger selon le rôle de l'utilisateur
    if (currentUser.role === 'acheteur') {
      this.router.navigate(['/home']);
    } else if (
      currentUser.role === 'boutique' ||
      currentUser.role === 'admin'
    ) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
