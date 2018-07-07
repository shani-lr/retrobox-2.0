import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';

import { App } from '../models/app.model';
import { AuthService } from '../../auth/auth.service';
import { AppState } from '../models/app-state.model';
import { Team, TeamData } from '../models/team.model';
import { AppUser } from '../models/user.model';

@Injectable()
export class DataService {
  private appCollection = 'app';
  private appDoc: AngularFirestoreDocument<App>;

  constructor(private authService: AuthService, private db: AngularFirestore) {
    this.appDoc = this.db.collection(this.appCollection).doc<App>(this.appCollection);
  }

  getAppState(): Observable<AppState> {
    return Observable.combineLatest(
      this.appDoc.valueChanges(), this.authService.getLoggedInUserName(),
      (app: App, user: string) => {
        const appUser = this.findUser(app, user);
        const team = this.findUsersTeam(app, appUser);
        return {
          app: app,
          user: appUser,
          team: team,
          teamData: null
        };
      })
      .mergeMap((appState: AppState) => {
        if (appState.team) {
          return this.db.collection(this.appCollection).doc(appState.team.name).valueChanges();
        }
        return Observable.of(null);
        },
        (appState: AppState, teamData: TeamData) => {
        console.log({
          ...appState,
          teamData: teamData
        });
          return {
            ...appState,
            teamData: teamData
          };
        });
  }

  updateApplication(updatedApplication: App): Observable<void> {
    return Observable.from(this.appDoc.update(updatedApplication));
  }

  createTeam(teamName: string, teamData: TeamData): Observable<void> {
    return Observable.from(this.db.collection(this.appCollection).doc(teamName).set(teamData));
  }

  updateTeam(teamToUpdateName: string, team: TeamData): Observable<void> {
    return Observable.from(this.db.collection('app').doc(teamToUpdateName).update(team));
  }

  private findUser(app: App, user: string): AppUser {
    if (app && user) {
      return app.users.find(x => x.name === user) || null;
    }
    return null;
  }

  private findUsersTeam(app: App, user: AppUser): Team {
    if (user) {
      return app.teams.find(x => x.name === user.team);
    }
    return null;
  }
}
