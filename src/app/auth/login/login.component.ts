import { Component } from '@angular/core';
import { AlertConsts } from '../../shared/alert/alert.consts';

@Component({
  selector: 'app-login',
  template: `
    <div class="wrapper">
      <app-alert [alert]="alertError"></app-alert>
    </div>`,
  styles:['.wrapper { margin: 1em; }']
})
export class LoginComponent  {
  alertError = {
    ...AlertConsts.danger,
    message: "You need to be logged in to view this page."
  }
}
