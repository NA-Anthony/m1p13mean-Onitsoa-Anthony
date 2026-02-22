import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    console.log('🔐 [AuthInterceptor]', {
      url: req.url,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : 'null'
    });

    if (token) {
      // Cloner la requête et ajouter le token dans le header Authorization
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('✅ Token ajouté au header');
    } else {
      console.warn('⚠️ Pas de token disponible');
    }

    return next.handle(req);
  }
}
