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
  teamMembers: ['Marry James', 'Charlie Perl'],
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
  },
  loggedInUserName: 'Patrick Star',
  teamToCreate: {
    name: 'Charizard',
    admins: ['Patrick Star'],
    vote: false
  },
  updatedApplicationWithTeamToCreate: {
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
    },{
      name: 'Charizard',
      admins: ['Patrick Star'],
      vote: false
    }]
  },
  teamToCreateData: {
    sprints: ['1000'],
    1000: []
  },
  teamToJoin: 'Panda',
  updatedApplicationWithUserToAdd: {
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
    }, {
      name: 'Patrick Star',
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
    }, {
      name: 'Charizard',
      admins: ['Patrick Star'],
      vote: false
    }]
  }
};
