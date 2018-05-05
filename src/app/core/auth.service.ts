import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from '@firebase/app';

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

}
