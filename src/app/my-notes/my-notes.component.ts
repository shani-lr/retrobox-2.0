import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { Note } from '../core/models/note.model';
import { AppUser } from '../core/models/user.model';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.css']
})
export class MyNotesComponent implements OnInit, OnDestroy {
  newNote: '';
  myNotes: Note[];
  private notes: Note[];
  private user: AppUser;
  private sprint = '';
  private teamData;
  private teamSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(private datePipe: DatePipe, private dataService: DataService) {
  }

  ngOnInit() {
    this.userSubscription = this.dataService.getUser().subscribe(user => {
      this.user = user;
      this.teamSubscription = this.dataService.getTeam(this.user.team)
        .subscribe((doc: {sprints: string[]}) => {
          this.teamData = doc;
          if (this.teamData.sprints) {
            this.sprint = this.teamData.sprints[this.teamData.sprints.length - 1];
            this.notes = this.teamData && this.teamData[this.sprint] ? this.teamData[this.sprint] : [];
            this.myNotes =
              this.teamData && this.teamData[this.sprint] ? this.teamData[this.sprint].filter(note => note.by === this.user.name) : [];
          }
        });
    });
  }

  onSave() {
    if (this.newNote) {
      const date = this.datePipe.transform(new Date(), 'MMM d');
      this.notes.push({ text: this.newNote, by: this.user.name, group: '', at: date});
      this.teamData[this.sprint] = this.notes;
      this.dataService.updateTeam(this.user.team, this.teamData);
      this.newNote = '';
    }
  }

  onCancel() {
    this.newNote = '';
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    if (this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    }
  }
}
