import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const roles = route.data?.['roles'] as Array<string> || [];
    const userRoles = this.authService.getRole() || [];

    if (!isAuthenticated) {
      this.router.navigate(['/not-authorized']);
      return false;
    }

    if (roles.length === 0 || roles.some(role => userRoles.includes(role))) {
      return true;
    } else {
      // If the user does not have the required role, redirect to the not-authorized page
      Swal.fire({
        title: 'Access Denied',
        text: 'You do not have permission to access this page.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.router.navigate(['/not-authorized']);
      return false;
      return false;
    }
  }
}
