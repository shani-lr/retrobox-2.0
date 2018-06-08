import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../shared/data.service';
import { AppUser } from '../core/models/user.model';
import { App } from '../core/models/app.model';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit, OnDestroy {
  user: AppUser;
  currentSprint: string;
  addAnotherAdmin: boolean;
  newAdmin: string;
  teamMembers: string[];
  message: string;
  private app: App;
  private team: { sprints: string[] };
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.dataService.getUser().subscribe(user => {
      this.user = user;
      this.subscriptions.push(this.dataService.getTeam(this.user.team)
        .subscribe((doc: { sprints: string[] }) => {
          this.team = doc;
          if (this.team.sprints) {
            this.currentSprint = this.team.sprints[this.team.sprints.length - 1];
          }
        }));
    }));
    this.subscriptions.push(this.dataService.getNonAdminTeamMembers().subscribe(teamMembers => {
      this.teamMembers = teamMembers;
    }));
    this.subscriptions.push(this.dataService.getApplication().subscribe(app => this.app = app));
  }

  createNewSprint() {
    const newSprint = `${((+this.currentSprint) + 1)}`;
    this.team.sprints.push(newSprint);
    this.team[newSprint] = [];
    this.subscriptions.push(
      this.dataService.updateTeam(this.user.team, this.team).subscribe(() => {
      this.message = `Sprint ${newSprint} was successfully added!`;
      this.currentSprint = newSprint;
    }));
  }

  onAddAnotherAdmin() {
    const teamIndex = this.app.teams.findIndex(x => x.name === this.user.team);
    const team = this.app.teams[teamIndex];
    team.admins.push(this.newAdmin);
    team.admins = team.admins.filter(this.onlyUnique);
    this.app.teams.splice(teamIndex, 1);
    this.app.teams.push(team);
    this.subscriptions.push(this.dataService.updateApplication(this.app).subscribe(() => {
        this.addAnotherAdmin = false;
        this.message = `${this.newAdmin} was successfully added as admin!`;
        this.newAdmin = '';
        this.subscriptions.push(this.dataService.getNonAdminTeamMembers().subscribe(teamMembers => {
          this.teamMembers = teamMembers;
        }));
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
