import { Component } from '@angular/core';
import * as firebase from '@firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public authService: AuthService) { }

  login() {
    this.authService.login();
  }
  logout() {
    this.authService.logout();
  }

}
