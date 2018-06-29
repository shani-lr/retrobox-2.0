import { Injectable } from '@angular/core';
import { AppState } from '../core/models/app-state.model';
import { Team, TeamData } from '../core/models/team.model';
import { App } from '../core/models/app.model';

@Injectable()
export class AdministrationService {

  static getIsVotingOn(appState: AppState): boolean {
    return !!appState && !!appState.team && appState.team.vote;
  }

  static getNonAdminTeamMembers(appState: AppState): string[] {
    const teamMembers = appState.app.users
      .filter(user => user.team === appState.user.team)
      .map(user => user.name);
    return teamMembers.filter(user => !appState.team.admins.includes(user));
  }

  static getCurrentSprint(appState: AppState): string {
    if (!!appState && !!appState.teamData && !!appState.teamData.sprints) {
      return appState.teamData.sprints[appState.teamData.sprints.length - 1];
    }
    return null;
  }

  static getTeamDataWithNewSprint(newSprint: string, teamData: TeamData): TeamData {
    const teamDataWithNewSprint = {
      ...teamData,
      sprints: [...teamData.sprints, newSprint]
    };
    teamDataWithNewSprint[newSprint] = [];
    return teamDataWithNewSprint;
  }

  static getAppWithUpdatedTeamAdmins(app: App, currentTeam: Team, newAdmin: string): App {
    const currentTeamWithNewAdmin = {
      ...currentTeam,
      admins: [...currentTeam.admins, newAdmin]
    };

    return this.getAppWithUpdatedTeam(app, currentTeamWithNewAdmin);
  }

  static getAppWithUpdatedTeamVote(app: App, currentTeam: Team, vote: boolean): App {
    const currentTeamWithUpdatedVote = {
      ...currentTeam,
      vote: vote
    };

    return this.getAppWithUpdatedTeam(app, currentTeamWithUpdatedVote);
  }

  private static getAppWithUpdatedTeam(app: App, updatedTeam: Team): App {
    const teamsWithoutTeamToUpdate =
      app.teams.filter(team => team.name !== updatedTeam.name);

    return {
      ...app,
      teams: [...teamsWithoutTeamToUpdate, updatedTeam]
    };
  }

  static getTeamDataWithClearVote(teamData: TeamData): TeamData {
    return {
      ...teamData,
      vote: []
    };
  }

}
