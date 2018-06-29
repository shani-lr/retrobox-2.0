import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from '@firebase/app';
import { User } from 'firebase';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  login(): Observable<any> {
    return Observable.from(this.angularFireAuth.auth.signInWithPopup(new firebase.firebase.auth.GoogleAuthProvider()));
  }

  logout(): Observable<any> {
    return Observable.from(this.angularFireAuth.auth.signOut());
  }

  get authState(): Observable<User | null> {
    return this.angularFireAuth.authState;
  }

  isLoggedIn(): Observable<boolean> {
    return this.angularFireAuth.authState.map((user: User) => !!user);
  }
}
