import { Injectable } from '@angular/core';

import { Team } from '../models/team.model';
import { App } from '../models/app.model';
import { AppUser } from '../models/user.model';

@Injectable()
export class AppService {

  getAppWithUpdatedTeamAdmins(app: App, currentTeam: Team, newAdmin: string): App {
    const currentTeamWithNewAdmin = {
      ...currentTeam,
      admins: [...currentTeam.admins, newAdmin]
    };

    return this.getAppWithUpdatedTeam(app, currentTeamWithNewAdmin);
  }

  getUpdatedApplicationWithTeamToCreate(app: App, teamToCreate: Team): App {
    return {
      ...app,
      teams: [...app.teams, teamToCreate]
    };
  }

  getUpdatedApplicationWithUserToAdd(app: App, user: string, team: string): App {
    const userToAdd: AppUser = {
      name: user,
      team: team,
      font: '\'Open Sans\', sans-serif'
    };

    return {
      ...app,
      users: [...app.users, userToAdd]
    };
  }


  getAppWithUpdatedTeamVote(app: App, currentTeam: Team, vote: boolean): App {
    const currentTeamWithUpdatedVote = {
      ...currentTeam,
      vote: vote
    };

    return this.getAppWithUpdatedTeam(app, currentTeamWithUpdatedVote);
  }

  getAppWithUpdatedTeamMembers(app: App, team: Team, userToRemove: string) {
    const updatedTeam = {
      ...team,
      admins: [...team.admins].filter(admin => admin !== userToRemove)
    };

    const appWithUpdatedTeam = this.getAppWithUpdatedTeam(app, updatedTeam);

    return {
      ...appWithUpdatedTeam,
      users: appWithUpdatedTeam.users.filter(u => u.name !== userToRemove)
    }
  }

  getUpdatedApplicationWithUserToUpdate(app: App, userToUpdate: AppUser): App {
    const userToUpdateIndex =
      app.users.findIndex(u => u.name === userToUpdate.name && u.team === userToUpdate.team);

    return {
      ...app,
      users: [...app.users.slice(0, userToUpdateIndex), userToUpdate, ...app.users.slice(userToUpdateIndex + 1)]
    };
  }


  private getAppWithUpdatedTeam(app: App, updatedTeam: Team): App {
    const teamsWithoutTeamToUpdate =
      app.teams.filter(team => team.name !== updatedTeam.name);

    return {
      ...app,
      teams: [...teamsWithoutTeamToUpdate, updatedTeam]
    };
  }
}
