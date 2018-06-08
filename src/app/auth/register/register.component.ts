import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'firebase';

import { TeamExtended } from '../../core/models/team.model';
import { AuthService } from '../auth.service';
import { App } from '../../core/models/app.model';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  team = '';
  teamToCreate: TeamExtended = {
    name: '',
    admins: [],
    sprint: ''
  };
  createTeam = false;
  app: App;
  private user: User;
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.authService.authState.subscribe(res => {
        this.user = res;
        this.teamToCreate.admins = [this.user.displayName];
      }));

    this.subscriptions.push(this.dataService.getApplication()
      .subscribe((appDoc: App) => this.app = appDoc));
  }

  onCreateTeam() {
    this.app.teams.push({name: this.teamToCreate.name, admins: this.teamToCreate.admins});
    this.subscriptions.push(this.dataService.updateApplication(this.app).subscribe());
    const doc = {sprints: [this.teamToCreate.sprint]};
    doc[this.teamToCreate.sprint] = [];
    this.dataService.createApplicationDocument(this.teamToCreate.name, doc)
      .then(() => {
        this.createTeam = false;
        this.team = this.teamToCreate.name;
      });
  }

  onJoinTeam() {
    this.app.users.push({name: this.user.displayName, team: this.team});
    this.subscriptions.push(this.dataService.updateApplication(this.app).subscribe());
    this.router.navigate(['/my-notes']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
