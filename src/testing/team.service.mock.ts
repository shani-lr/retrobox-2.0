import { Team, TeamData } from '../app/shared/models/team.model';
import { AppState } from '../app/shared/models/app-state.model';
import { Note } from '../app/shared/models/note.model';

export class TeamServiceMock {
  getCurrentSprint(teamData: TeamData): string {
    return "";
  }

  getIsVotingOn(team: Team): boolean {
    return false;
  }

  getNonAdminTeamMembers(appState: AppState): string[] {
    return undefined;
  }

  getOldSprints(teamData: TeamData): string[] {
    return undefined;
  }

  getTeamDataWithNewSprint(newSprint: string, teamData: TeamData): TeamData {
    return undefined;
  }

  getTeamDataWithUpdatedNotes(currentTeamData: TeamData, sprint: string, updatedNotes: Note[]): TeamData {
    return undefined;
  }

  getTeamToCreate(teamToCreateName: string, admin: string): Team {
    return undefined;
  }

  getTeamToCreateData(teamToCreateSprint: string): TeamData {
    return undefined;
  }

}
