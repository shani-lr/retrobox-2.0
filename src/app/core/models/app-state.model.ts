import { AppUser } from './user.model';
import { Team, TeamData } from './team.model';
import { App } from './app.model';

export interface AppState {
  app: App;
  user: AppUser;
  team: Team;
  teamData: TeamData;
}
