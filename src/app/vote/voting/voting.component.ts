import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../../shared/services/data.service';
import { Note } from '../../shared/models/note.model';
import { AppState } from '../../shared/models/app-state.model';
import { AlertConsts } from '../../shared/alert/alert.consts';
import { Alert } from '../../shared/models/alert.model';
import { TeamService } from '../../shared/services/team.service';
import { NotesService } from '../../shared/services/notes.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit, OnDestroy {
  notes: Note[];
  mySelectedNotesText: string[];
  voteInfoAlert: Alert = {
    ...AlertConsts.info,
    message: 'You have 3 votes, use them to vote on the issues matter to you by selecting them (to unselect an issue click it again).'
  };
  voteErrorAlert: Alert;
  private sprint = '';
  private subscriptions: Subscription[] = [];
  private appState: AppState;

  constructor(private dataService: DataService, private teamService: TeamService,
              private notesService: NotesService, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.dataService.getAppState().subscribe((appState: AppState) => {
        this.appState = appState;
        if (this.appState) {
          this.sprint = this.teamService.getCurrentSprint(this.appState.teamData);
          this.notes = this.notesService.getNotes(this.appState.teamData, this.sprint);
          this.mySelectedNotesText =
            this.notesService.getMySelectedNotesText(this.notes, this.appState.user);
        }
      }));
  }

  toggleVote(note: Note): void {
    this.voteErrorAlert = null;
    if (this.mySelectedNotesText.length === 3 &&
      this.notesService.shouldAddVote(this.mySelectedNotesText, note)) {
      this.voteErrorAlert = {
        ...AlertConsts.danger,
        message: 'You have used up all your votes.'
      };
      return;
    }

    this.spinner.show();

    this.subscriptions.push(
      this.dataService.updateTeamWithToggledVoteInTransaction(
        this.mySelectedNotesText, note.text, this.appState.user, this.appState.team.name, this.sprint)
        .subscribe(
          () => this.spinner.hide()
        ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
