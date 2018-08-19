import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';

import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../shared/models/app-state.model';
import { Alert } from '../../shared/models/alert.model';
import { AlertConsts } from '../../shared/alert/alert.consts';
import { TeamService } from '../../shared/services/team.service';

@Component({
  selector: 'app-old-retros',
  templateUrl: './old-retros.component.html',
  styleUrls: ['./old-retros.component.scss']
})
export class OldRetrosComponent implements OnInit, OnDestroy {
  sprints: string[];
  selectedSprint: string;
  chooseSprintAlert: Alert = {
    ...AlertConsts.info,
    message: 'Choose an old sprint to view its retro.'
  };
  font: string;
  private appStateSubscription: Subscription;

  constructor(private dataService: DataService, private teamService: TeamService) {
  }

  ngOnInit(): void {
    this.appStateSubscription =
      this.dataService.getAppState().subscribe((appState: AppState) => {
        if (appState) {
          this.sprints = this.teamService.getOldSprints(appState.teamData);
          this.font = appState.user.font;
        }
      });
  }

  ngOnDestroy(): void  {
    this.appStateSubscription.unsubscribe();
  }
}
