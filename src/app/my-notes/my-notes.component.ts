import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { Note } from '../core/models/note.model';
import { AppUser } from '../core/models/user.model';
import { DataService } from '../shared/data.service';
import { AppState } from '../core/models/app-state.model';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.css']
})
export class MyNotesComponent implements OnInit, OnDestroy {
  newNote: '';
  myNotes: Note[];
  private appState: AppState;
  private notes: Note[];
  private sprint = '';
  private subscriptions: Subscription[] = [];

  constructor(private datePipe: DatePipe, private dataService: DataService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.dataService.getAppState().subscribe((appState: AppState) => {
      this.appState = appState;
      if (this.appState && this.appState.teamData && this.appState.teamData.sprints) {
        this.sprint = this.appState.teamData.sprints[this.appState.teamData.sprints.length - 1];
        this.notes = this.appState.teamData[this.sprint] ? this.appState.teamData[this.sprint] : [];
        this.myNotes = this.appState.teamData[this.sprint] ?
          this.appState.teamData[this.sprint]
          .filter(note => note.by === this.appState.user.name) : [];
      }
    }));
  }

  onSave() {
    if (this.newNote) {
      const date = this.datePipe.transform(new Date(), 'MMM d');
      this.notes.push({ text: this.newNote, by: this.appState.user.name, group: '', at: date});
      this.appState.teamData[this.sprint] = this.notes;
      this.subscriptions.push(
        this.dataService.updateTeam(this.appState.user.team, this.appState.teamData).subscribe());
      this.newNote = '';
    }
  }

  onCancel() {
    this.newNote = '';
  }

  onDelete(note: Note) {
    const noteToDeleteIndex =
      this.notes.findIndex(x => x.by === this.appState.user.name && x.at === note.at && x.text === note.text);
    this.notes.splice(noteToDeleteIndex, 1);
    this.appState.teamData[this.sprint] = this.notes;
    this.subscriptions.push(
      this.dataService.updateTeam(this.appState.user.team, this.appState.teamData).subscribe());
    this.newNote = '';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
