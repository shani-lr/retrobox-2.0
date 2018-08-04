import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { DataService } from '../../shared/services/data.service';
import { AppState } from '../../shared/models/app-state.model';
import { PermissionsService } from '../../shared/services/permissions.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private dataService: DataService,
              private permissionsService: PermissionsService,
              private router: Router) {
  }

  canActivate(): Observable<boolean> {

    return this.dataService.getAppState().map((appState: AppState) => {
      const isRegistered = this.permissionsService.isRegistered(appState);
      if (!isRegistered) {
        this.router.navigate(['/register']);
      }
      return isRegistered;
    });
  }
}
