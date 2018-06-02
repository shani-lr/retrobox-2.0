import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  private app: App;
  private team: { sprints: string[] };
  private userSubscription: Subscription;
  private teamSubscription: Subscription;
  private teamMembersSubscription: Subscription;
  private appSubscription: Subscription;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.userSubscription = this.dataService.getUser().subscribe(user => {
      this.user = user;
      this.teamSubscription = this.dataService.getTeam(this.user.team)
        .subscribe((doc: {sprints: string[]}) => {
          this.team = doc;
          if (this.team.sprints) {
            this.currentSprint = this.team.sprints[this.team.sprints.length - 1];
          }
        });
    });
    this.teamMembersSubscription = this.dataService.getNonAdminTeamMembers().subscribe(teamMembers => {
      this.teamMembers = teamMembers;
    });
    this.appSubscription = this.dataService.getApplication().subscribe(app => this.app = app);
  }

  createNewSprint() {
    const newSprint = `${((+this.currentSprint) + 1)}`;
    this.team.sprints.push(newSprint);
    this.team[newSprint] = [];
    this.dataService.updateTeam(this.user.team, this.team);
    this.router.navigate(['/my-notes']);
  }

  onAddAnotherAdmin() {
    const teamIndex = this.app.teams.findIndex(x => x.name === this.user.team);
    const team = this.app.teams[teamIndex];
    team.admins.push(this.newAdmin);
    this.app.teams.splice(teamIndex, 1);
    this.app.teams.push(team);
    this.dataService.updateApplication(this.app);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    if (this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    }
    this.teamMembersSubscription.unsubscribe();
    this.appSubscription.unsubscribe();
  }
}
