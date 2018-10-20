import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Note, NoteState, MyNote } from '../shared/models/note.model';
import { DataService } from '../shared/services/data.service';
import { AppState } from '../shared/models/app-state.model';
import { NotesService } from '../shared/services/notes.service';
import { TeamService } from '../shared/services/team.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.scss']
})
export class MyNotesComponent implements OnInit, OnDestroy {
  myNotes: MyNote[];
  noteState = NoteState;
  font: string;
  private appState: AppState;
  private notes: Note[];
  private sprint = '';
  private subscriptions: Subscription[] = [];

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
          this.myNotes = this.notesService.getMyNotesWithNewNote(this.notes, this.appState.user);
          this.font = this.appState.user.font;
        }
      }));
  }

  onSave(note: MyNote): void {
    if (note) {
      this.spinner.show();
      this.subscriptions.push(
        this.dataService.updateTeamWithUserNoteTransaction(
          this.appState.user.team, this.sprint, note)
          .subscribe(() => this.spinner.hide()));
    }
  }

  onCancel(note: MyNote): void {
    if (note.state === NoteState.New) {
      note.updatedText = '';
    } else if (note.state === NoteState.Edit) {
      note.updatedText = note.text;
      note.state = NoteState.Saved;
    }
  }

  onDelete(note: MyNote): void {
    note.state = NoteState.Deleted;
    this.onSave(note);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
