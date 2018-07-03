import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../shared/services/data.service';
import { AppState } from '../shared/models/app-state.model';
import { AlertConsts } from '../shared/alert/alert.consts';
import { Alert } from '../shared/models/alert.model';
import { AppService } from '../shared/services/app.service';
import { TeamService } from '../shared/services/team.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit, OnDestroy {
  appState: AppState;
  currentSprint: string;
  isAddAdminSelected: boolean;
  newAdmin: string;
  nonAdminTeamMembers: string[];
  isVotingOn: boolean;
  alert: Alert;
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private teamService: TeamService,
              private administrationService: AppService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getAppState().subscribe((appState: AppState) => {
      this.appState = appState;
      if (this.appState) {
        this.isVotingOn = this.teamService.getIsVotingOn(this.appState.team);
        this.nonAdminTeamMembers = this.teamService.getNonAdminTeamMembers(this.appState);
        this.currentSprint = this.teamService.getCurrentSprint(this.appState.teamData);
      }
    }));
  }

  createNewSprint(): void {
    const newSprint = `${((+this.currentSprint) + 1)}`;
    const teamDataWithNewSprint =
      this.teamService.getTeamDataWithNewSprint(newSprint, this.appState.teamData);

    this.subscriptions.push(
      this.dataService.updateTeam(this.appState.team.name, teamDataWithNewSprint).subscribe(() => {
        this.alert = {
          ...AlertConsts.success,
          message: `Sprint ${newSprint} was successfully added!`
        };
      }));
  }

  addAdmin(): void {
    const appWithUpdatedTeamAdmins =
      this.administrationService.getAppWithUpdatedTeamAdmins(this.appState.app, this.appState.team, this.newAdmin);

    this.subscriptions.push(
      this.dataService.updateApplication(appWithUpdatedTeamAdmins).subscribe(() => {
        this.alert = {
          ...AlertConsts.success,
          message: `${this.newAdmin} was successfully added as admin!`
        };
        this.resetAddAdminState();
      }));
  }

  resetAddAdminState(): void {
    this.isAddAdminSelected = false;
    this.newAdmin = '';
    this.nonAdminTeamMembers = this.teamService.getNonAdminTeamMembers(this.appState);
  }

  openVote(): void {
    this.changeVotingState(true);
  }

  closeVote(): void {
    this.changeVotingState(false);
  }

  changeVotingState(vote: boolean): void {
    const appWithUpdatedTeamVote =
      this.administrationService.getAppWithUpdatedTeamVote(this.appState.app, this.appState.team, vote);

    this.subscriptions.push(
      this.dataService.updateApplication(appWithUpdatedTeamVote).subscribe(() =>
        this.alert = {
        ...AlertConsts.success,
        message: `The vote is now ${vote ? 'open' : 'closed'}!`
      }));
  }

  onShowResults(): void {
    this.router.navigate(['vote-results']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
