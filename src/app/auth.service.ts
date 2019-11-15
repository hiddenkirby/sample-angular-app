import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { shareReplay } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import * as auth0 from 'auth0-js';

// Auth0 client ID
const clientID = '8y6tZ3QM3qXlx7oMfmFoEa7ZHphaLzsI';

const ACCESS_TOKEN_NAME = 'accessToken';
const ID_TOKEN_NAME = 'idToken';

// This is now the Factchain User
export interface User {
  id: number;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface KeyRegistration {
  registered: boolean;
  mobile?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  // tslint:disable-next-line:variable-name
  private _accessToken: string;
  // tslint:disable-next-line:variable-name
  private _idToken: string;

  private $keyRegistration: Observable<KeyRegistration>;
  private $user: Observable<User>;

  private auth0 = new auth0.WebAuth({
    clientID: '8y6tZ3QM3qXlx7oMfmFoEa7ZHphaLzsI',
    domain: 'factchain-pen.auth0.com',
    audience: 'https://factchain.com/api', // Factchain API identifier
    responseType: 'token id_token',
    // redirectUri: 'http://app.local:4200/authCallback',
    redirectUri: 'http://localhost:4200/authCallback',
    scope: 'openid profile email' // Request publisher scope
  });

  constructor(private httpClient: HttpClient) {}

  init() {
    // Note we deliberately use the synchronous localStorage here to avoid
    // race conditions when reloading a guarded page. When using the async
    // IndexDB the auth-guard would redirect to the login page before the
    // async function retrieving the token completed.
    const token = localStorage.getItem(ACCESS_TOKEN_NAME);

    if (!this.jwtHelper.isTokenExpired(token)) {
      this._accessToken = token;
      this._idToken = localStorage.getItem(ID_TOKEN_NAME);

      // Force load of user
      const user = this.user;
      if (user != null) {
        user.subscribe();
      }

      // Force load of key registration
      const keyReg = this.keyRegistration;
      if (keyReg != null) {
        this.keyRegistration.subscribe();
      }
    } else {
      localStorage.removeItem(ACCESS_TOKEN_NAME);
      localStorage.removeItem(ID_TOKEN_NAME);
    }
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  get authId(): string {
    return this.idToken ? this.jwtHelper.decodeToken(this.idToken).sub : null;
  }

  get keyRegistration(): Observable<KeyRegistration> {
    if (this.$keyRegistration == null && this.isAuthenticated()) {
      this.$keyRegistration = this.httpClient
        .get<KeyRegistration>(`${environment.factchainUrl}/keyRegistration`)
        .pipe(shareReplay(1));
    }
    return this.$keyRegistration;
  }

  get email(): string {
    return this.idToken ? this.jwtHelper.decodeToken(this.idToken).email : null;
  }

  get user(): Observable<User> {
    if (this.$user == null && this.isAuthenticated()) {
      this.$user = this.httpClient
        .get<User>(`${environment.factchainUrl}/users/current`)
        .pipe(shareReplay(1));
    }
    return this.$user;
  }

  public handleAuthentication(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.auth0.parseHash(
        { responseType: 'token id_token' },
        (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.localLogin(authResult);
            const route = sessionStorage.getItem(authResult.state);
            if (route) {
              sessionStorage.removeItem(authResult.state);
            }
            resolve({ isAuthenticated: this.isAuthenticated(), route });
          } else if (err) {
            reject(err);
          }
        }
      );
    });
  }

  private localLogin(authResult) {
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    localStorage.setItem(ACCESS_TOKEN_NAME, this._accessToken);
    localStorage.setItem(ID_TOKEN_NAME, this._idToken);

    // Force load of user
    this.user.subscribe();

    // Force load of key registration
    this.keyRegistration.subscribe();
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return this.accessToken && !this.jwtHelper.isTokenExpired(this.accessToken);
  }

  public login(): void {
    this.auth0.authorize();
  }

  public logout(): void {
    // Remove tokens
    this._accessToken = '';
    this._idToken = '';
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    localStorage.removeItem(ID_TOKEN_NAME);

    this.auth0.logout({
      clientID,
      returnTo: 'http://localhost:4200/logout'
    });
  }
}
