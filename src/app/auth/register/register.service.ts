import { Injectable } from '@angular/core';

import { Team, TeamData } from '../../core/models/team.model';
import { App } from '../../core/models/app.model';
import { AppUser } from '../../core/models/user.model';

@Injectable()
export class RegisterService {

  static getTeamToCreate(teamToCreateName: string, admin: string): Team {
    return {
      name: teamToCreateName,
      admins: [admin],
      vote: false
    };
  }

  static getUpdatedApplicationWithTeamToCreate(app: App, teamToCreate: Team): App {
    return {
      ...app,
      teams: [...app.teams, teamToCreate]
    };
  }

  static getTeamToCreateData(teamToCreateSprint: string): TeamData {
    const teamData: TeamData = {
      sprints: [teamToCreateSprint],
      vote: []
    };
    teamData[teamToCreateSprint] = [];
    return teamData;
  }

  static getUpdatedApplicationWithUserToAdd(app: App, user: string, team: string): App {
    const userToAdd: AppUser = {
      name: user,
      team: team
    };

    return {
      ...app,
      users: [...app.users, userToAdd]
    };
  }


}
