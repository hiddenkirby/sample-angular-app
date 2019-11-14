import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService
      .handleAuthentication()
      .then(authResponse => {
        console.log('authResponse: ', authResponse);
        if (authResponse.route) {
          this.router.navigate([authResponse.route]);
        } else {
          this.router.navigate(['/']);
        }
      }, rejected => {
        console.error('Auth Rejected: authResponse: ', rejected);
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('Error: ', error);
        this.router.navigate(['/']);
      });
  }

}
