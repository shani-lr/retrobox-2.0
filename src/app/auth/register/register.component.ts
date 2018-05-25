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
    admin: '',
    sprint: ''
  };
  createTeam = false;
  app: App;
  private user: User;
  private appSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(private dataService: DataService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userSubscription =
      this.authService.authState.subscribe(res => this.user = res);

    this.appSubscription = this.dataService.getApplication()
      .subscribe((appDoc: App) => this.app = appDoc);
  }

  onCreateTeam() {
    this.app.teams.push({name: this.teamToCreate.name, admin: this.teamToCreate.admin});
    this.dataService.updateApplication(this.app);
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
    this.dataService.updateApplication(this.app);
    this.router.navigate(['/my-notes']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.appSubscription.unsubscribe();
  }
}