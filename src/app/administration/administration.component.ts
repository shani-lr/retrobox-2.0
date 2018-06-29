import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../shared/data.service';
import { AppState } from '../core/models/app-state.model';
import { AlertConsts } from '../shared/alert/alert.consts';
import { Alert } from '../core/models/alert.model';
import { AdministrationService } from './administration.service';

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

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getAppState().subscribe((appState: AppState) => {
      this.appState = appState;
      this.isVotingOn = AdministrationService.getIsVotingOn(this.appState);
      this.nonAdminTeamMembers = AdministrationService.getNonAdminTeamMembers(this.appState);
      this.currentSprint = AdministrationService.getCurrentSprint(this.appState);
    }));
  }

  createNewSprint(): void {
    const newSprint = `${((+this.currentSprint) + 1)}`;
    const teamDataWithNewSprint =
      AdministrationService.getTeamDataWithNewSprint(newSprint, this.appState.teamData);

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
      AdministrationService.getAppWithUpdatedTeamAdmins(this.appState.app, this.appState.team, this.newAdmin);

    this.subscriptions.push(
      this.dataService.updateApplication(appWithUpdatedTeamAdmins).subscribe(() => {
        this.alert = {
          ...AlertConsts.success,
          message: `${this.newAdmin} was successfully added as admin!`
        };
        this.resetAddAdminState();
      }));
  }

  resetAddAdminState() {
    this.isAddAdminSelected = false;
    this.newAdmin = '';
    this.nonAdminTeamMembers = AdministrationService.getNonAdminTeamMembers(this.appState);
  }

  openVote(): void {
    this.clearVote();
    this.changeVotingState(true);
  }

  closeVote(): void {
    this.changeVotingState(false);
  }

  changeVotingState(vote: boolean): void {
    const appWithUpdatedTeamVote =
      AdministrationService.getAppWithUpdatedTeamVote(this.appState.app, this.appState.team, vote);

    this.subscriptions.push(
      this.dataService.updateApplication(appWithUpdatedTeamVote).subscribe(() =>
        this.alert = {
        ...AlertConsts.success,
        message: `The vote is now ${vote ? 'open' : 'closed'}!`
      }));
  }

  clearVote() {
    const updatedTeamData = AdministrationService.getTeamDataWithClearVote(this.appState.teamData);

    this.subscriptions.push(
      this.dataService.updateTeam(this.appState.user.team, updatedTeamData).subscribe());
  }

  onShowResults(): void {
    this.router.navigate(['vote-results']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
