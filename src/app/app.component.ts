import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    } else {
      this.authService.login();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }

}
