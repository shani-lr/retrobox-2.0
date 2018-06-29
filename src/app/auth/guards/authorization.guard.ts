import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { DataService } from '../../shared/data.service';
import { AppState } from '../../core/models/app-state.model';
import { PermissionsService } from '../permissions.service';


@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private dataService: DataService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.dataService.getAppState().map((appState: AppState) => {
      const isRegistered = PermissionsService.isRegistered(appState);
      if (!isRegistered) {
        this.router.navigate(['/register']);
      }
      return isRegistered;
    });
  }
}
