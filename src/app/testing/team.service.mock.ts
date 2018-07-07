import { Team, TeamData } from '../shared/models/team.model';
import { AppState } from '../shared/models/app-state.model';
import { Note } from '../shared/models/note.model';
import * as appStateMock from './app.state.mock';

export class TeamServiceMock {
  currentSprint = '1002';
  newSprint = '1003';
  isVotingOn = false;
  nonAdminUsers = ['Charlie Perl', 'Marry James'];
  teamToCreateName = 'Corgi';
  teamDataWithNewSprint = {
    ...appStateMock.appState.teamData,
    sprints: [...appStateMock.appState.teamData.sprints, '1003']
  };
  teamToCreate = {
    name: this.teamToCreateName,
    admins: ['Shani Laster'],
    vote: false
  };
  teamToCreateData = {
    sprints: [this.newSprint]
  };

  getCurrentSprint(teamData: TeamData): string {
    if (JSON.stringify(teamData) === JSON.stringify(appStateMock.appState.teamData)) {
      return this.currentSprint;
    }
    return null;
  }

  getIsVotingOn(team: Team): boolean {
    if (JSON.stringify(team) === JSON.stringify(appStateMock.appState.team)) {
      return this.isVotingOn;
    }
    return null;
  }

  getNonAdminTeamMembers(appState: AppState): string[] {
    if (JSON.stringify(appState) === JSON.stringify(appStateMock.appState))
    return this.nonAdminUsers;
  }

  getOldSprints(teamData: TeamData): string[] {
    return undefined;
  }

  getTeamDataWithNewSprint(newSprint: string, teamData: TeamData): TeamData {
    if (JSON.stringify(teamData) === JSON.stringify(appStateMock.appState.teamData) &&
      newSprint === this.newSprint) {
      return this.teamDataWithNewSprint;
    }
    return null;
  }

  getTeamDataWithUpdatedNotes(currentTeamData: TeamData, sprint: string, updatedNotes: Note[]): TeamData {
    return undefined;
  }

  getTeamToCreate(teamToCreateName: string, admin: string): Team {
    if (teamToCreateName === this.teamToCreate.name && admin === this.teamToCreate.admins[0]) {
      return this.teamToCreate;
    }
    return null;
  }

  getTeamToCreateData(teamToCreateSprint: string): TeamData {
    if (teamToCreateSprint === this.newSprint) {
      return this.teamToCreateData;
    }
    return null;
  }

}
