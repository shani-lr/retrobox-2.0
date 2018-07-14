import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Note, NoteState, MyNote } from '../shared/models/note.model';
import { DataService } from '../shared/services/data.service';
import { AppState } from '../shared/models/app-state.model';
import { NotesService } from '../shared/services/notes.service';
import { TeamService } from '../shared/services/team.service';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.scss']
})
export class MyNotesComponent implements OnInit, OnDestroy {
  myNotes: MyNote[];
  noteState = NoteState;
  private appState: AppState;
  private notes: Note[];
  private sprint = '';
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private teamService: TeamService,
              private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.dataService.getAppState().subscribe((appState: AppState) => {
        this.appState = appState;
        if (this.appState) {
          this.sprint = this.teamService.getCurrentSprint(this.appState.teamData);
          this.notes = this.notesService.getNotes(this.appState.teamData, this.sprint);
          this.myNotes = this.notesService.getMyNotesWithNewNote(this.notes, this.appState.user);
        }
      }));
  }

  onSave(note: MyNote): void {
    if (note) {
      const updatedNotes = this.notesService.getNotesWithUpdatedUserNotes(this.notes, note);

      const updatedTeamData =
        this.teamService.getTeamDataWithUpdatedNotes(this.appState.teamData, this.sprint, updatedNotes);

      this.subscriptions.push(
        this.dataService.updateTeam(this.appState.user.team, updatedTeamData).subscribe());
    }
  }

  onCancel(note: MyNote): void {
    if(note.state === NoteState.New) {
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
