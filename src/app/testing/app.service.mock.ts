import { App } from '../shared/models/app.model';
import { Team } from '../shared/models/team.model';
import { appState } from './app.state.mock';

export class AppServiceMock {
  newAdmin = 'Charlie Perl';

  newUser = 'Shani Laster';

  teamToCreate = {
    name: 'Corgi',
    admins: ['Shani Laster'],
    vote: false
  };

  appWithUpdatedTeamAdmins = {
    ...appState.app,
    teams: [{
      name: 'Panda',
      admins: ['Shani Laster', this.newAdmin],
      vote: false
    }, {
      name: 'Fox',
      admins: ['John Doe'],
      vote: false
    }]
  };

  appWithUpdatedVoteOn = {
    ...appState.app,
    teams: [{
      name: 'Panda',
      admins: ['Shani Laster'],
      vote: true
    }, {
      name: 'Fox',
      admins: ['John Doe'],
      vote: false
    }]
  };
  appWithNewTeam = {
    ...appState.app,
    teams: [{
      name: 'Panda',
      admins: ['Shani Laster', 'Charlie Perl'],
      vote: true
    }, {
      name: 'Fox',
      admins: ['John Doe'],
      vote: false
    }, {
      ...this.teamToCreate
    }]
  };

  appWithNewUser = {
    ...appState.app,
    users: [{
      name: 'Shani Laster',
      team: 'Panda'
    }, {
      name: 'Marry James',
      team: 'Panda'
    }, {
      name: 'Charlie Perl',
      team: 'Panda'
    }, {
      name: this.newUser,
      team: appState.team.name
    }]
  };

  private getAppWithUpdatedTeam(app: App, updatedTeam: Team): App {
    return undefined;
  }

  getAppWithUpdatedTeamAdmins(app: App, currentTeam: Team, newAdmin: string): App {
    if (JSON.stringify(app) === JSON.stringify(appState.app)
      && JSON.stringify(currentTeam) === JSON.stringify(appState.team)
      && newAdmin == this.newAdmin) {
      return this.appWithUpdatedTeamAdmins;
    }
    return null;
  }

  getAppWithUpdatedTeamVote(app: App, currentTeam: Team, vote: boolean): App {
    if (JSON.stringify(app) === JSON.stringify(appState.app)
      && JSON.stringify(currentTeam) === JSON.stringify(appState.team)) {
      return vote ? this.appWithUpdatedVoteOn : appState.app;
    }
    return null;
  }

  getUpdatedApplicationWithTeamToCreate(app: App, teamToCreate: Team): App {
    if (JSON.stringify(app) === JSON.stringify(appState.app)
      && JSON.stringify(teamToCreate) === JSON.stringify(this.teamToCreate)) {
      return this.appWithNewTeam;
    }
    return null;
  }

  getUpdatedApplicationWithUserToAdd(app: App, user: string, team: string): App {
    if (JSON.stringify(app) === JSON.stringify(appState.app)
      && user === this.newUser && team === appState.team.name) {
      return this.appWithNewUser;
    }
    return null;
  }

}
