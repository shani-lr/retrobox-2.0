import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from '@firebase/app';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

@Injectable()
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  login(): Observable<any> {
    return Observable.from(this.angularFireAuth.auth.signInWithPopup(
      new firebase.firebase.auth.GoogleAuthProvider()));
  }

  logout(): Observable<any> {
    return Observable.from(this.angularFireAuth.auth.signOut());
  }

  isLoggedIn(): Observable<boolean> {
    return this.angularFireAuth.authState.map((user: { displayName: string }) => !!user);
  }

  getLoggedInUserName(): Observable<string> {
    return this.angularFireAuth.authState.map((user: { displayName: string }) => {
      return user ? user.displayName : null;
    });
  }
}
