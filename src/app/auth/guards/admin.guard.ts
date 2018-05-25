import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { DataService } from '../../shared/data.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private dataService: DataService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.dataService.isAdmin().map((isAdmin: boolean) => {
      if (!isAdmin) {
        this.router.navigate(['/login-admin']);
      }
      return isAdmin;
    });
  }
}
