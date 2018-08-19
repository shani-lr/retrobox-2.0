import { AppState } from '../app/shared/models/app-state.model';

export class PermissionsServiceMock {
  isAdmin(appState: AppState): boolean {
    return false;
  }

  isRegistered(appState: AppState): boolean {
    return false;
  }

}
