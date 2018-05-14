import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from 'angularfire2/firestore/document/document';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore } from 'angularfire2/firestore';
import { DragulaService } from 'ng2-dragula';
import 'rxjs/add/operator/map';

import { AuthService } from '../core/auth.service';
import { Note } from '../core/note.model';
import { AppUser } from '../core/user.model';
import { User } from 'firebase';
import { Team } from '../core/team.model';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.css'],
  viewProviders: [DragulaService]
})
export class RetroComponent implements OnInit, OnDestroy {
  notesByGroups: {group: string, notes: Note[]}[] = [];
  notes: Note[];
  isAdmin: boolean;
  private document: AngularFirestoreDocument<{ notes: Note[] }>;
  private teamName = '';
  private sprint = '';
  private notesSubscription: Subscription;
  private userSubscription: Subscription;
  private dragulaSubscription: Subscription;
  private user: User;
  private appDocument: AngularFirestoreDocument<{users: AppUser[], teams: Team[]}>;
  private appSubscription: Subscription;
  private teamDocument: AngularFirestoreDocument<{sprints: string[]}>;
  private teamsSubscription: Subscription;
  private notesDocument: AngularFirestoreDocument<{notes: Note[]}>;
  private team: Team;

  constructor(private db: AngularFirestore, public authService: AuthService, private dragulaService: DragulaService) {
  }

  ngOnInit() {
    this.dragulaService.setOptions('first-bag', {
      moves: function (el: any, container: any, handle: any): any {
        return el.tagName !== 'INPUT';
      }
    });

    this.userSubscription =
      this.authService.authState.subscribe(res => {
        this.user = res;

        // get user's team
        this.appDocument = this.db.collection('app').doc('app');
        this.appSubscription = this.appDocument.valueChanges()
          .subscribe((appDoc: { users: AppUser[], teams: Team[]}) => {
            this.teamName = appDoc.users.find(
              user => user.name.toLowerCase() === this.user.displayName.toLowerCase()).team;
            this.team = appDoc.teams.find(
              x => x.name.toLowerCase() === this.teamName.toLowerCase());
            this.isAdmin = this.user.displayName === this.team.admin;

            // get team's sprint
            this.teamDocument = this.db.collection(this.teamName).doc('sprints');
            this.teamsSubscription = this.teamDocument.valueChanges()
              .subscribe((teamDoc: {sprints: string[]}) => {
                this.sprint = teamDoc.sprints[teamDoc.sprints.length - 1];

                // get notes for user
                this.notesDocument = this.db.collection(this.teamName).doc(this.sprint);
                this.notesSubscription = this.notesDocument.valueChanges()
                  .subscribe((doc: { notes: Note[] }) => {
                    this.notes = doc && doc.notes ? doc.notes : [];
                    this.notesByGroups = [];
                    this.mapNotesToGroups();
                  });
              });
          });

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
    this.notes.forEach(function(note: Note) {
      if (groupNotes.indexOf(note.text) > -1) {
        note.group = title;
      }
    });
    this.document.update({ notes: this.notes });
  }

  mapNotesToGroups() {
    this.notes.map(note => {
      if (!note.group) {
        this.notesByGroups.push({group: '', notes:
            [{ text: note.text, by: note.by, at: note.at, group: '' }]});
      } else {
        const groupIndex = this.notesByGroups.map(x => x.group).indexOf(note.group);
        if (groupIndex > -1) {
          this.notesByGroups[groupIndex].notes.push(
            {text: note.text, by: note.by, group: note.group, at: note.at});
        } else {
          this.notesByGroups.push({group: note.group, notes:
              [{text: note.text, by: note.by, group: note.group, at: note.at}]});
        }
      }
    });

  }

  ngOnDestroy() {
    this.notesSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.dragulaSubscription.unsubscribe();
  }
}
