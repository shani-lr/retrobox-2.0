import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'firebase';

import { Team, TeamData } from '../../shared/models/team.model';
import { AuthService } from '../auth.service';
import { App } from '../../shared/models/app.model';
import { DataService } from '../../shared/services/data.service';
import { AppState } from '../../shared/models/app-state.model';
import { AlertConsts } from '../../shared/alert/alert.consts';
import { TeamService } from '../../shared/services/team.service';
import { AppService } from '../../shared/services/app.service';

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

  constructor(private authService: AuthService, private dataService: DataService,
              private teamService: TeamService, private appService: AppService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.authState.subscribe((user: User) => this.user = user));

    this.subscriptions.push(
      this.dataService.getAppState().subscribe((appState: AppState) => this.app = appState.app));
  }

  createTeam(): void {
    const teamToCreate: Team = this.teamService.getTeamToCreate(this.teamToCreateName, this.user.displayName);
    const updateApplication: App = this.appService.getUpdatedApplicationWithTeamToCreate(this.app, teamToCreate);

    this.subscriptions.push(
      this.dataService.updateApplication(updateApplication).subscribe(() => {
          const teamData: TeamData = this.teamService.getTeamToCreateData(this.teamToCreateSprint);
          this.subscriptions.push(this.dataService.createTeam(this.teamToCreateName, teamData)
            .subscribe(() => {
              this.showCreateTeam = false;
              this.teamToJoin = this.teamToCreateName;
            }));
        }
      ));
  }

  onJoinTeam(): void {
    const appToUpdate = this.appService
      .getUpdatedApplicationWithUserToAdd(this.app, this.user.displayName, this.teamToJoin);
    this.subscriptions.push(this.dataService.updateApplication(appToUpdate).subscribe());
    this.router.navigate(['/my-notes']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
