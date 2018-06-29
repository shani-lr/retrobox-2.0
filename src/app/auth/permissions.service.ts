import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AppState } from '../core/models/app-state.model';

@Injectable()
export class PermissionsService {

  static isAdmin(appState: AppState): boolean {
    return !!appState && !!appState.user && !!appState.team
      && appState.team.admins.includes(appState.user.name);
  }

  static isRegistered(appState: AppState): boolean {
    return !!appState && !!appState.user;
  }

}
