import { Component } from '@angular/core';

import { AlertConsts } from '../../shared/alert/alert.consts';

@Component({
  selector: 'app-login-admin',
  template: `
    <div class="wrapper">
      <app-alert [alert]="alertError"></app-alert>
    </div>`,
  styles:['.wrapper { margin: 1em; }']
})
export class LoginAdminComponent  {
  alertError = {
    ...AlertConsts.danger,
    message: "You need to be logged in as admin to view this page."
  }
}
