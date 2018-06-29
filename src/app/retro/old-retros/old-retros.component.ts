import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';

import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../core/models/app-state.model';

@Component({
  selector: 'app-old-retros',
  templateUrl: './old-retros.component.html',
  styleUrls: ['./old-retros.component.css']
})
export class OldRetrosComponent implements OnInit, OnDestroy {
  sprints: string[];
  selectedSprint: string;
  private appStateSubscription: Subscription;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.appStateSubscription =
      this.dataService.getAppState().subscribe((appState: AppState) => {
        this.sprints = appState.teamData.sprints;
        this.sprints.splice(-1, 1);
      });
  }

  ngOnDestroy() {
    this.appStateSubscription.unsubscribe();
  }
}
