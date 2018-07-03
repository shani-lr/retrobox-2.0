import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AppState } from '../models/app-state.model';

@Injectable()
export class PermissionsService {

  isAdmin(appState: AppState): boolean {
    return !!appState && !!appState.user && !!appState.team
      && appState.team.admins.includes(appState.user.name);
  }

  isRegistered(appState: AppState): boolean {
    return !!appState && !!appState.user;
  }

}
