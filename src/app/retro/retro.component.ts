import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from 'angularfire2/firestore/document/document';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore } from 'angularfire2/firestore';
import { DragulaService } from 'ng2-dragula';
import 'rxjs/add/operator/map';

import { Note } from '../core/models/note.model';
import { DataService } from '../shared/data.service';
import { AppUser } from '../core/models/user.model';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.css'],
  viewProviders: [DragulaService]
})
export class RetroComponent implements OnInit, OnDestroy {
  notesByGroups: { group: string, notes: Note[] }[] = [];
  notes: Note[];
  private user: AppUser;
  private sprint = '';
  private userSubscription: Subscription;
  private teamSubscription: Subscription;
  private dragulaSubscription: Subscription;
  private teamData: { sprints: string[] };

  constructor(private db: AngularFirestore, private dragulaService: DragulaService, private dataService: DataService) {
  }

  ngOnInit() {
    this.configureDragula();

    this.userSubscription =
      this.dataService.getAppUser().subscribe(user => {
      this.user = user;
      this.teamSubscription = this.dataService.getTeam(this.user.team)
        .subscribe((doc: {sprints: string[]}) => {
          this.teamData = doc;
          if (this.teamData && this.teamData.sprints) {
            this.sprint = this.teamData.sprints[this.teamData.sprints.length - 1];
            this.notes = this.teamData && this.teamData[this.sprint] ? this.teamData[this.sprint] : [];
            this.notesByGroups = [];
            this.mapNotesToGroups();
          }
        });
    });
  }

  private configureDragula() {
    this.dragulaService.setOptions('first-bag', {
      moves: function (el: any, container: any, handle: any): any {
        return el.tagName !== 'INPUT';
      }
    });

    this.dragulaSubscription =
      this.dragulaService.drop.subscribe((value) => {
        const destination = value[2];
        const source = value[3];
        this.removeGroup(source);
        this.saveGroup(destination.children[0]);
      });
  }

  removeGroup(group) {
    if (group.childElementCount < 2) {
      group.remove();
    }
  }

  saveGroup(inputTitle) {
    const title = inputTitle.value;
    const group = inputTitle.parentElement;
    const groupNotesElements = group.querySelectorAll('.note .card-title');
    const groupNotes = Array.from(groupNotesElements, (groupNoteElement: HTMLElement) => groupNoteElement.textContent);
    this.notes.forEach(function (note: Note) {
      if (groupNotes.indexOf(note.text) > -1) {
        note.group = title;
      }
    });
    this.teamData[this.sprint] = this.notes;
    this.dataService.updateTeam(this.user.team, this.teamData);
  }

  mapNotesToGroups() {
    this.notes.map(note => {
      if (!note.group) {
        this.notesByGroups.push({
          group: '', notes:
            [{ text: note.text, by: note.by, at: note.at, group: '' }]
        });
      } else {
        const groupIndex = this.notesByGroups.map(x => x.group).indexOf(note.group);
        if (groupIndex > -1) {
          this.notesByGroups[groupIndex].notes.push(
            { text: note.text, by: note.by, group: note.group, at: note.at });
        } else {
          this.notesByGroups.push({
            group: note.group, notes:
              [{ text: note.text, by: note.by, group: note.group, at: note.at }]
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.dragulaSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    if (this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    }
  }
}
