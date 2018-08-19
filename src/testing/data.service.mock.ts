import { Observable } from 'rxjs/Observable';

import { TeamData } from '../app/shared/models/team.model';
import { AppState } from '../app/shared/models/app-state.model';
import { AppUser } from '../app/shared/models/user.model';
import { App } from '../app/shared/models/app.model';

export class DataServiceMock {
  createTeam(teamName: string, teamData: TeamData): Observable<void> {
    return undefined;
  }

  getAppState(): Observable<AppState> {
    return undefined;
  }

  updateApplication(updatedApplication: App): Observable<void> {
    return undefined;
  }

  updateTeam(teamToUpdateName: string, teamToUpdateData: TeamData): Observable<void> {
    return undefined;
  }

  updateTeamWithToggledVoteInTransaction(mySelectedNotesText: string[], note: string, user: AppUser, teamToUpdateName: string, teamToUpdateSprint: string): Observable<void> {
    return undefined;
  }
}
