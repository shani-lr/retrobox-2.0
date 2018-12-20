import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from '@firebase/app';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

@Injectable()
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  googleLogin(): Observable<any> {
    return Observable.from(this.angularFireAuth.auth.signInWithPopup(
      new firebase.firebase.auth.GoogleAuthProvider()));
  }

  login(email: string, password: string): Observable<any> {
    return Observable.from(this.angularFireAuth.auth.signInWithEmailAndPassword(email, password));
  }

  signup(email: string, password: string): Observable<any> {
    return Observable.from(this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password));
  }

  logout(): Observable<any> {
    return Observable.from(this.angularFireAuth.auth.signOut());
  }

  isLoggedIn(): Observable<boolean> {
    return this.angularFireAuth.authState.map((user: { displayName: string }) => !!user);
  }

  getLoggedInUserName(): Observable<string> {
    return this.angularFireAuth.authState.map((user: { displayName: string, email: string }) => {
      if (!user) {
        return null;
      }
      return user.displayName ? user.displayName : user.email.split('@')[0];
    });
  }
}
