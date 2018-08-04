import { App } from '../app/shared/models/app.model';
import { Team } from '../app/shared/models/team.model';

export class AppServiceMock {
  getAppWithUpdatedTeamAdmins(app: App, currentTeam: Team, newAdmin: string): App {
    return undefined;
  }

  getAppWithUpdatedTeamVote(app: App, currentTeam: Team, vote: boolean): App {
    return undefined;
  }

  getUpdatedApplicationWithTeamToCreate(app: App, teamToCreate: Team): App {
    return undefined;
  }

  getUpdatedApplicationWithUserToAdd(app: App, user: string, team: string): App {
    return undefined;
  }

}
