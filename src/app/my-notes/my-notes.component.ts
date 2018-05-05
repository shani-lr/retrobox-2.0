import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestoreDocument } from 'angularfire2/firestore/document/document';
import { AuthService } from '../core/auth.service';
import { User } from 'firebase';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.css']
})
export class MyNotesComponent implements OnInit, OnDestroy {
  newNote: '';
  notes: any[];
  myNotes: any[];
  user: User;
  private document: AngularFirestoreDocument<{ notes: {text: string, by: string}[] }>;
  private collectionId = 'notes';
  private documentId = '3ZV8XLxQcSpCpZA4qpJK';
  private notesSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(private db: AngularFirestore, public authService: AuthService) {
  }

  ngOnInit() {
    this.document = this.db.collection(this.collectionId).doc(this.documentId);
    this.userSubscription =
      this.authService.authState.subscribe(res => {
        this.user = res;
        this.notesSubscription = this.document.valueChanges()
          .subscribe((doc: { notes: {text: string, by: string}[] }) => {
            this.notes = doc ? doc.notes : undefined;
            this.myNotes = doc ? doc.notes.filter(x => x.by === this.user.displayName) : undefined;
          });
      });
  }

  onSave() {
    if (this.newNote) {
      this.notes.push({ text: this.newNote, by: this.user.displayName });
      this.document.update({ notes: this.notes });
      this.newNote = '';
    }
  }

  onCancel() {
    this.newNote = '';
  }

  ngOnDestroy() {
    this.notesSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
