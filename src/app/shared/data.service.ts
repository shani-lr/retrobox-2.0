import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

import { App } from '../core/models/app.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataService {
  private appDoc: AngularFirestoreDocument<App>;

  constructor(private authService: AuthService, private db: AngularFirestore) {
    this.appDoc = this.db.collection('app').doc<App>('app');
  }

  isRegistered(): Observable<boolean> {
    return Observable.combineLatest(this.appDoc.valueChanges(), this.authService.authState, (appDoc: App, user: User) => ({ appDoc, user }))
      .map(data => {
        let result = false;
        if (data.appDoc && data.user) {
          const appUser = data.appDoc.users.find(
            x => x.name === data.user.displayName);
          result = !!appUser;
        }
        return result;
      });
  }

  isAdmin(): Observable<boolean> {
    return Observable.combineLatest(this.appDoc.valueChanges(), this.authService.authState, (appDoc: App, user: User) => ({ appDoc, user }))
      .map(data => {
        let result = false;
        if (data.appDoc && data.user) {
          const appUser = data.appDoc.users.find(
            x => x.name === data.user.displayName);
          if (appUser) {
            const team = data.appDoc.teams.find(
              x => x.name === appUser.team);
            if (team) {
              result = team.admins.includes(appUser.name);
            }
          }
        }
        return result;
      });
  }

  isVotingOn(): Observable<boolean> {
    return Observable.combineLatest(this.appDoc.valueChanges(), this.authService.authState, (appDoc: App, user: User) => ({ appDoc, user }))
      .map(data => {
        let result = false;
        if (data.appDoc && data.user) {
          const appUser = data.appDoc.users.find(
            x => x.name === data.user.displayName);
          if (appUser) {
            const team = data.appDoc.teams.find(
              x => x.name === appUser.team);
            if (team && team.vote) {
              result = true;
            }
          }
        }
        return result;
      });
  }


  getApplication(): Observable<App> {
    return this.appDoc.valueChanges();
  }

  updateApplication(updatedApplication: App) {
    return Observable.from(this.appDoc.update(updatedApplication));
  }

  createApplicationDocument(name: string, value: any): Promise<void> {
    return this.db.collection('app').doc(name).set(value);
  }

  getUser() {
    return Observable.combineLatest(this.appDoc.valueChanges(), this.authService.authState, (appDoc: App, user: User) => ({ appDoc, user }))
      .map(data => {
        if (data.appDoc && data.user) {
          return data.appDoc.users.find(
            x => x.name === data.user.displayName);
         }
      });
  }

  getTeam(teamName: string) {
    return this.db.collection('app').doc(teamName).valueChanges();
  }

  updateTeam(teamName: string, team) {
    return Observable.from(this.db.collection('app').doc(teamName).update(team));
  }

  getNonAdminTeamMembers() {
    return Observable.combineLatest(this.appDoc.valueChanges(), this.authService.authState, (appDoc: App, user: User) => ({ appDoc, user }))
      .map(data => {
        if (data.appDoc && data.user) {
          const appUser = data.appDoc.users.find(
            x => x.name === data.user.displayName);
          if (appUser) {
            const team = data.appDoc.teams.find(t => t.name === appUser.team);
            return data.appDoc.users
              .filter(user => user.team === appUser.team)
              .map(user => user.name)
              .filter(user => !team.admins.includes(user));
          }
        }
      });
  }

  getVoteType(): Observable<string> {
    return Observable.combineLatest(this.appDoc.valueChanges(), this.authService.authState, (appDoc: App, user: User) => ({ appDoc, user }))
      .map(data => {
        let result = '';
        if (data.appDoc && data.user) {
          const appUser = data.appDoc.users.find(
            x => x.name === data.user.displayName);
          if (appUser) {
            const team = data.appDoc.teams.find(
              x => x.name === appUser.team);
            if (team && team.vote) {
              result = team.voteType;
            }
          }
        }
        return result;
      });
  }

}
