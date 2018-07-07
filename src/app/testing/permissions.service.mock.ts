import { AppState } from '../shared/models/app-state.model';
import * as appStateMock from './app.state.mock';

export class PermissionsServiceMock {
  admin = false;
  registered = false;

  isAdmin(appState: AppState): boolean {
    if (JSON.stringify(appState) === JSON.stringify(appStateMock.appState)) {
      return this.admin;
    }
    return null;
  }

  isRegistered(appState: AppState): boolean {
    if (JSON.stringify(appState) === JSON.stringify(appStateMock.appState)) {
      return this.registered;
    }
    return null;
  }

}
