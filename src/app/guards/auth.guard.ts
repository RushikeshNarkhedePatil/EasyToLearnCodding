import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedRoles: (UserRole | 'guest')[] | undefined = route.data['roles'];

    if (!this.authService.isAuthenticated()) {
      if (allowedRoles && allowedRoles.includes('guest')) {
        return true;
      }
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!this.authService.hasAnyRole(allowedRoles)) {
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    return true;
  }
}





