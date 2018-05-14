import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestoreDocument } from 'angularfire2/firestore/document/document';
import { User } from 'firebase';

import { AuthService } from '../core/auth.service';
import { Note } from '../core/note.model';
import { DatePipe } from '@angular/common';
import { AppUser } from '../core/user.model';
import { Team } from '../core/team.model';

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
  private notesDocument: AngularFirestoreDocument<{notes: Note[]}>;
  private appDocument: AngularFirestoreDocument<{users: AppUser[], teams: Team[]}>;
  private teamDocument: AngularFirestoreDocument<{sprints: string[]}>;
  private notesSubscription: Subscription;
  private userSubscription: Subscription;
  private appSubscription: Subscription;
  private teamsSubscription: Subscription;

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
          .subscribe((appDoc: { users: AppUser[], teams: Team[]}) => {
            this.team = appDoc.users.find(
              user => user.name.toLowerCase() === this.user.displayName.toLowerCase()).team;

            // get team's sprint
            this.teamDocument = this.db.collection(this.team).doc('sprints');
            this.teamsSubscription = this.teamDocument.valueChanges()
              .subscribe((teamDoc: {sprints: string[]}) => {
                this.sprint = teamDoc.sprints[teamDoc.sprints.length - 1];

                // get notes for user
                this.notesDocument = this.db.collection(this.team).doc(this.sprint);
                this.notesSubscription = this.notesDocument.valueChanges()
                  .subscribe((doc: { notes: Note[] }) => {
                    this.notes = doc && doc.notes ? doc.notes : [];
                    this.myNotes = this.user && doc && doc.notes ? doc.notes.filter(x => x.by === this.user.displayName) : [];
                  });
              });
          });

      });
    }

  onSave() {
    if (this.newNote) {
      const date = this.datePipe.transform(new Date(), 'MMM d');
      this.notes.push({ text: this.newNote, by: this.user.displayName, group: '', at: date});
      this.notesDocument.update({ notes: this.notes });
      this.newNote = '';
    }
  }

  onCancel() {
    this.newNote = '';
  }

  ngOnDestroy() {
    this.notesSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.appSubscription.unsubscribe();
  }
}
