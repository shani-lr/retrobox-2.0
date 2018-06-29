import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../shared/data.service';
import { AppState } from '../../core/models/app-state.model';
import { PermissionsService } from '../permissions.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private dataService: DataService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.dataService.getAppState().map((appState: AppState) => {
      const isAdmin = PermissionsService.isAdmin(appState);
      if (!isAdmin) {
        this.router.navigate(['/login-admin']);
      }
      return isAdmin;
    });
  }
}
