import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-old-retros',
  templateUrl: './old-retros.component.html',
  styleUrls: ['./old-retros.component.css']
})
export class OldRetrosComponent implements OnInit, OnDestroy {
  sprints: string[];
  selectedSprint: string;
  private userSubscription: Subscription;
  private teamSubscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.userSubscription =
    this.dataService.getUser().subscribe(user => {
      this.teamSubscription =
        this.dataService.getTeam(user.team)
          .subscribe((team: {sprints: string[]}) => {
            this.sprints = team.sprints;
            this.sprints.splice(-1, 1);
          });
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    if (this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    }
  }
}
