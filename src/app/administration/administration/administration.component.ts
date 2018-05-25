import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../../shared/data.service';
import { AppUser } from '../../core/models/user.model';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {
  user: AppUser;
  currentSprint: string;
  private team: { sprints: string[] };
  private userSubscription: Subscription;
  private teamSubscription: Subscription;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.userSubscription = this.dataService.getAppUser().subscribe(user => {
      this.user = user;
      this.teamSubscription = this.dataService.getTeam(this.user.team)
        .subscribe((doc: {sprints: string[]}) => {
          this.team = doc;
          if (this.team.sprints) {
            this.currentSprint = this.team.sprints[this.team.sprints.length - 1];
          }
        });
    });
  }

  createNewSprint() {
    const newSprint = `${((+this.currentSprint) + 1)}`;
    this.team.sprints.push(newSprint);
    this.team[newSprint] = [];
    this.dataService.updateTeam(this.user.team, this.team);
    this.router.navigate(['/my-notes']);
  }
}
