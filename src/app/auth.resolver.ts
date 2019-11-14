import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      if (this.authService.accessToken) {
        // Expired token? Initiate login.
        this.authService.login(state.url);
      } else {
        // No token? Perhaps this is the first time the user has visited the
        // site in the browser? Maybe they need to enroll. Send them to home page.
        this.router.navigate(['/']);

      }
      // console.log('not allowed.');
      return false;
    }
    // console.log('allowed. Routing.');
    return true;
  }
}
