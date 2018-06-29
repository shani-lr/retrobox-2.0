import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'firebase';

import { Team, TeamData } from '../../core/models/team.model';
import { AuthService } from '../auth.service';
import { App } from '../../core/models/app.model';
import { DataService } from '../../shared/data.service';
import { AppState } from '../../core/models/app-state.model';
import { RegisterService } from './register.service';
import { AlertConsts } from '../../shared/alert/alert.consts';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerAlert = {
    ...AlertConsts.info,
    message: 'Seems like you don\'t have a team 😢 Join one!'
  };
  teamToJoin = '';
  teamToCreateSprint = '';
  teamToCreateName = '';
  showCreateTeam = false;
  app: App;
  private subscriptions: Subscription[] = [];
  private user: User;

  constructor(private authService: AuthService,
              private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.authState.subscribe((user: User) => this.user = user));

    this.subscriptions.push(
      this.dataService.getAppState().subscribe((appState: AppState) => this.app = appState.app));
  }

  createTeam(): void {
    const teamToCreate: Team = RegisterService.getTeamToCreate(this.teamToCreateName, this.user.displayName);
    const updateApplication: App = RegisterService.getUpdatedApplicationWithTeamToCreate(this.app, teamToCreate);

    this.subscriptions.push(
      this.dataService.updateApplication(updateApplication).subscribe(() => {
          const teamData: TeamData = RegisterService.getTeamToCreateData(this.teamToCreateSprint);
          this.subscriptions.push(this.dataService.createTeam(this.teamToCreateName, teamData)
            .subscribe(() => {
              this.showCreateTeam = false;
              this.teamToJoin = this.teamToCreateName;
            }));
        }
      ));
  }

  onJoinTeam(): void {
    const appToUpdate =
      RegisterService.getUpdatedApplicationWithUserToAdd(
        this.app, this.user.displayName, this.teamToJoin);
    this.subscriptions.push(this.dataService.updateApplication(appToUpdate).subscribe());
    this.router.navigate(['/my-notes']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
