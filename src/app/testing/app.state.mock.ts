import { AppState } from '../shared/models/app-state.model';

export const appState: AppState = {
  app: {
    users: [{
      name: 'Shani Laster',
      team: 'Panda'
    }, {
      name: 'Marry James',
      team: 'Panda'
    }, {
      name: 'Charlie Perl',
      team: 'Panda'
    }],
    teams: [{
      name: 'Panda',
      admins: ['Shani Laster'],
      vote: false
    }, {
      name: 'Fox',
      admins: ['John Doe'],
      vote: false
    }]
  },
  user: {
    name: 'Shani Laster',
    team: 'Panda'
  },
  team: {
    name: 'Panda',
    admins: ['Shani Laster'],
    vote: false
  },
  teamData: {
    sprints: ['1000', '1001', '1002']
  }
};
