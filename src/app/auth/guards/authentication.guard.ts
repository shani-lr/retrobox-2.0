import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().map((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
      return isLoggedIn;
    });
  }
}
