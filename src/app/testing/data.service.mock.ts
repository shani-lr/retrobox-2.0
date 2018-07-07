import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { TeamData } from '../shared/models/team.model';
import { App } from '../shared/models/app.model';
import { AppState } from '../shared/models/app-state.model';
import { appState } from './app.state.mock';

export class DataServiceMock {

  getAppState(): Observable<AppState> {
    return Observable.of(appState);
  }

  createTeam(teamName: string, teamData: TeamData) {
    return Observable.of({});
  }

  updateApplication(updatedApplication: App) {
    return Observable.of({});
  }

  updateTeam(teamToUpdateName: string, team: TeamData) {
    return Observable.of({});
  }

}
