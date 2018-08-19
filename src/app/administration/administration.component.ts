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
  isRemoveTeamMemberSelected: boolean;
  newAdmin: string;
  userToRemove: string;
  nonAdminTeamMembers: string[];
  teamMembers: string[];
  isVotingOn: boolean;
  alert: Alert;
  font: string;
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private teamService: TeamService,
              private appService: AppService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getAppState().subscribe((appState: AppState) => {
      this.appState = appState;
      if (this.appState) {
        this.isVotingOn = this.teamService.getIsVotingOn(this.appState.team);
        this.nonAdminTeamMembers = this.teamService.getNonAdminTeamMembers(this.appState);
        this.teamMembers = this.teamService.getTeamMembers(this.appState);
        this.currentSprint = this.teamService.getCurrentSprint(this.appState.teamData);
        this.font = this.appState.user.font;
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
      this.appService.getAppWithUpdatedTeamAdmins(this.appState.app, this.appState.team, this.newAdmin);

    this.subscriptions.push(
      this.dataService.updateApplication(appWithUpdatedTeamAdmins).subscribe(() => {
        this.alert = {
          ...AlertConsts.success,
          message: `${this.newAdmin} was successfully added as admin!`
        };
        this.resetAddAdminState();
      }));
  }

  openVote(): void {
    this.changeVotingState(true);
  }

  closeVote(): void {
    this.changeVotingState(false);
  }

  onShowResults(): void {
    this.router.navigate(['vote-results']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private resetAddAdminState(): void {
    this.isAddAdminSelected = false;
    this.newAdmin = '';
    this.nonAdminTeamMembers = this.teamService.getNonAdminTeamMembers(this.appState);
  }

  private changeVotingState(vote: boolean): void {
    const appWithUpdatedTeamVote =
      this.appService.getAppWithUpdatedTeamVote(this.appState.app, this.appState.team, vote);

    this.subscriptions.push(
      this.dataService.updateApplication(appWithUpdatedTeamVote).subscribe(() =>
        this.alert = {
          ...AlertConsts.success,
          message: `The vote is now ${vote ? 'open' : 'closed'}!`
        }));
  }

  removeTeamMember() {
    const appWithUpdatedTeamMembers =
      this.appService.getAppWithUpdatedTeamMembers(this.appState.app, this.appState.team, this.userToRemove);

    this.subscriptions.push(
      this.dataService.updateApplication(appWithUpdatedTeamMembers).subscribe(() => {
        this.alert = {
          ...AlertConsts.success,
          message: `${this.userToRemove} was removed successfully.`
        };
        this.resetRemoveTeamMemberState();
      })
    )
  }

  private resetRemoveTeamMemberState(): void {
    this.isRemoveTeamMemberSelected = false;
    this.userToRemove = '';
    this.teamMembers = this.teamService.getTeamMembers(this.appState);
  }
}
