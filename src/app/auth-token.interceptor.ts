import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq = req;
    // TODO make sure we're calling and endpoint that needs the token
    if (this.authService.accessToken) {
      newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.accessToken}`
        }
      });
    }
    return next.handle(newReq);
  }
}
