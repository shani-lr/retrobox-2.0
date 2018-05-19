import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestoreDocument } from 'angularfire2/firestore/document/document';
import { User } from 'firebase';

import { AuthService } from '../core/auth.service';
import { Note } from '../core/note.model';
import { DatePipe } from '@angular/common';
import { AppUser } from '../core/user.model';
import { Team, TeamExtended } from '../core/team.model';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.css']
})
export class MyNotesComponent implements OnInit, OnDestroy {
  newNote: '';
  notes: Note[];
  myNotes: Note[];
  user: User;
  team = '';
  sprint = '';
  isNewUser = true;
  teams: Team[] = [];
  users: AppUser[];
  teamToCreate: TeamExtended = {
    name: '',
    admin: '',
    sprint: ''
  };
  createTeam = false;
  private notesDocument: AngularFirestoreDocument<any>;
  private appDocument: AngularFirestoreDocument<{users: AppUser[], teams: Team[]}>;
  private notesSubscription: Subscription;
  private userSubscription: Subscription;
  private appSubscription: Subscription;

  constructor(private db: AngularFirestore, public authService: AuthService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    // get user
    this.userSubscription =
      this.authService.authState.subscribe(res => {
        this.user = res;

        // get user's team
        this.appDocument = this.db.collection('app').doc('app');
        this.appSubscription = this.appDocument.valueChanges()
          .subscribe((appDoc: { users: AppUser[], teams: Team[] }) => {
            const appUser = appDoc.users.find(
              user => user.name.toLowerCase() === this.user.displayName.toLowerCase());
            this.teams = appDoc.teams;
            this.users = appDoc.users;

            if (appUser) {
              this.isNewUser = false;
              this.team = appUser.team;

              // get notes for user
              this.notesDocument = this.db.collection('app').doc(this.team);
              this.notesSubscription = this.notesDocument.valueChanges()
                .subscribe(doc => {
                  if (doc && doc.sprints) {
                    this.sprint = doc.sprints[doc.sprints.length - 1];
                    this.notes = doc && doc[this.sprint] ? doc[this.sprint] : [];
                    this.myNotes = this.user && doc && doc[this.sprint] ? doc[this.sprint].filter(x => x.by === this.user.displayName) : [];
                  }
                });
            }
          });
      });
  }

  onSave() {
    if (this.newNote) {
      const date = this.datePipe.transform(new Date(), 'MMM d');
      this.notes.push({ text: this.newNote, by: this.user.displayName, group: '', at: date});
      const result = {};
      result[this.sprint] = this.notes;
      this.notesDocument.update(result);
      this.newNote = '';
    }
  }

  onCancel() {
    this.newNote = '';
  }

  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
  }

  onCreateTeam() {
    this.teams.push({name: this.teamToCreate.name, admin: this.teamToCreate.admin});
    this.appDocument.update({teams: this.teams, users: this.users});
    const doc = {sprints: [this.teamToCreate.sprint]};
    doc[this.teamToCreate.sprint] = [];
    this.db.collection('app').doc(this.teamToCreate.name)
      .set(doc)
      .then(() => {
        this.createTeam = false;
        this.team = this.teamToCreate.name;
      });
  }

  onJoinTeam() {
    this.users.push({name: this.user.displayName, team: this.team});
    this.appDocument.update({teams: this.teams, users: this.users});
  }
}
