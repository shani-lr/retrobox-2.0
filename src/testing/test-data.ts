export const testData = {
  appState: {
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
      }, {
        name: 'John Doe',
        team: 'Fox'
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
  },
  nonAdminTeamMembers: ['Marry James', 'Charlie Perl'],
  teamDataWithNewSprint: {
    sprints: ['1000', '1001', '1002', '1003']
  },
  appWithUpdatedTeamAdmins: {
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
      name: 'John Doe',
      team: 'Fox'
    }],
    teams: [{
      name: 'Panda',
      admins: ['Shani Laster', 'Charlie Perl'],
      vote: false
    }, {
      name: 'Fox',
      admins: ['John Doe'],
      vote: false
    }]
  },
  newNonAdminTeamMembers: ['Marry James'],
  appWithUpdatedTeamVoteOpen: {
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
      name: 'John Doe',
      team: 'Fox'
    }],
    teams: [{
      name: 'Panda',
      admins: ['Shani Laster'],
      vote: true
    }, {
      name: 'Fox',
      admins: ['John Doe'],
      vote: false
    }]
  }
};
