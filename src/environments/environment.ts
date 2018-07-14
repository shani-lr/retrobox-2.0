// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCq6zNmLob4K4WfGDa8k8kgABBkFpy0piw',
    authDomain: 'retrobox-atom.firebaseapp.com',
    databaseURL: 'https://retrobox-atom.firebaseio.com',
    projectId: 'retrobox-atom',
    storageBucket: 'retrobox-atom.appspot.com',
    messagingSenderId: '990033875334'
  }
};
