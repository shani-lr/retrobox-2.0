import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../../shared/services/data.service';
import { AppState } from '../../shared/models/app-state.model';
import { NotesService } from '../../shared/services/notes.service';
import { TeamService } from '../../shared/services/team.service';
import { Note } from '../../shared/models/note.model';
import { Result } from '../../shared/models/result.model';
import { ResultsService } from './results.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, OnDestroy {

  view: any[] = [1000, 500];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Votes';
  showYAxisLabel = true;
  yAxisLabel = 'Subject';
  colorScheme = {
    domain: ['#0796ae', '#00bfd1', '#55e0d9', '#a7e790', '#e1fbae']
  };
  results: Result[] = [];
  private appState: AppState;
  private notes: Note[];
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private teamService: TeamService,
              private resultsService: ResultsService, private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.dataService.getAppState().subscribe((appState: AppState) => {
        this.appState = appState;
        const sprint = this.teamService.getCurrentSprint(this.appState.teamData);
        if (this.appState) {
          this.notes = this.notesService.getNotes(this.appState.teamData, sprint);
          if (this.notes) {
            this.results = this.resultsService.calculateVoteResults(this.notes);
          }
        }
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
