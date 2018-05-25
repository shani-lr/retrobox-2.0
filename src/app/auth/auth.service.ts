import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from '@firebase/app';
import { User } from 'firebase';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  login() {
    this.angularFireAuth.auth.signInWithPopup(new firebase.firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.angularFireAuth.auth.signOut();
  }

  get authState() {
    return this.angularFireAuth.authState;
  }

  isLoggedIn() {
    return this.angularFireAuth.authState.map((user: User) => !!user);
  }

}
