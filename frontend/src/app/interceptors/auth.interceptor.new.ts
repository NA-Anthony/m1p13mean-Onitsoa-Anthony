import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor fonctionnel pour ajouter le JWT aux requêtes (API Angular 17+)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('🔐 [AuthInterceptor Fonctionnel]', {
    url: req.url,
    method: req.method,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'null'
  });

  // Si nous avons un token, l'ajouter aux headers
  if (token) {
    console.log('✅ Ajout du token au header Authorization');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('⚠️ Pas de token disponible pour la requête:', req.url);
  }

  return next(req);
};
