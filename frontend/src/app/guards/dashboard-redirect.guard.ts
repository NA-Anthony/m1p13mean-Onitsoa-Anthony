import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const dashboardRedirectGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.getCurrentUser();

    if (!user) {
        return router.createUrlTree(['/login']);
    }

    const role = user.role;

    if (role === 'admin') {
        return true;
    } else if (role === 'boutique') {
        return router.createUrlTree(['/dashboard-boutique']);
    } else if (role === 'acheteur') {
        return router.createUrlTree(['/dashboard-acheteur']);
    }

    return true;
};
