import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../shared/services/data.service';
import { AppState } from '../../shared/models/app-state.model';
import { PermissionsService } from '../../shared/services/permissions.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private dataService: DataService,
              private permissionsService: PermissionsService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.dataService.getAppState().map((appState: AppState) => {
      const isAdmin = this.permissionsService.isAdmin(appState);
      if (!isAdmin) {
        this.router.navigate(['/login-admin']);
      }
      return isAdmin;
    });
  }
}
