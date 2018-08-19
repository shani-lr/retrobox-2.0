import { Injectable } from '@angular/core';

import { Team, TeamData } from '../models/team.model';
import { Note } from '../models/note.model';
import { AppState } from '../models/app-state.model';

@Injectable()
export class TeamService {

  getTeamToCreate(teamToCreateName: string, admin: string): Team {
    return {
      name: teamToCreateName,
      admins: [admin],
      vote: false
    };
  }

  getTeamToCreateData(teamToCreateSprint: string): TeamData {
    const teamData: TeamData = {
      sprints: [teamToCreateSprint]
    };
    teamData[teamToCreateSprint] = [];
    return teamData;
  }


  getCurrentSprint(teamData: TeamData): string {
    if (teamData && teamData.sprints) {
      const currentSprintIndex = teamData.sprints.length - 1;
      return teamData.sprints[currentSprintIndex];
    }
    return null;
  }

  getIsVotingOn(team: Team): boolean {
    return !!team && team.vote;
  }

  getNonAdminTeamMembers(appState: AppState): string[] {
    if (appState.app && appState.user && appState.team) {
      const teamMembers = appState.app.users
        .filter(user => user.team === appState.user.team)
        .map(user => user.name);
      return teamMembers.filter(user => !appState.team.admins.includes(user));
    }
    return [];
  }

  getTeamDataWithNewSprint(newSprint: string, teamData: TeamData): TeamData {
    const teamDataWithNewSprint = {
      ...teamData,
      sprints: [...teamData.sprints, newSprint]
    };
    teamDataWithNewSprint[newSprint] = [];
    return teamDataWithNewSprint;
  }

  getTeamDataWithUpdatedNotes(currentTeamData: TeamData, sprint: string, updatedNotes: Note[]): TeamData {
    const updatedTeamData = {
      ...currentTeamData
    };
    updatedTeamData[sprint] = updatedNotes;
    return updatedTeamData;
  }

  getOldSprints(teamData: TeamData): string[] {
    if (teamData && teamData.sprints) {
      return [...teamData.sprints.slice(0, teamData.sprints.length - 1)];
    }
    return null;
  }

  getTeamMembers(appState: AppState) {
    if (appState.app && appState.user && appState.team) {
      return appState.app.users
        .filter(user => user.team === appState.user.team && user.name !== appState.user.name)
        .map(user => user.name);
    }
    return [];
  }
}
