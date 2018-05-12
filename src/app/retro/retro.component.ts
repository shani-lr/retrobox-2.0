import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from 'angularfire2/firestore/document/document';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore } from 'angularfire2/firestore';
import { DragulaService } from 'ng2-dragula';
import 'rxjs/add/operator/map';

import { AuthService } from '../core/auth.service';
import { Note } from '../core/note.model';

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
  private collectionId = 'notes';
  private documentId = '3ZV8XLxQcSpCpZA4qpJK';
  private notesSubscription: Subscription;
  private userSubscription: Subscription;
  private dragulaSubscription: Subscription;

  constructor(private db: AngularFirestore, public authService: AuthService, private dragulaService: DragulaService) {
  }

  ngOnInit() {
    this.dragulaService.setOptions('first-bag', {
      moves: function (el: any, container: any, handle: any): any {
        return el.tagName !== 'INPUT';
      }
    });
    this.document = this.db.collection(this.collectionId).doc(this.documentId);
    this.userSubscription =
      this.authService.authState.subscribe(user => {
        this.isAdmin = user.displayName === 'Shani Laster';
      });
    this.notesSubscription = this.document.valueChanges()
      .subscribe((doc: { notes: Note[] }) => {
        this.notes = doc ? doc.notes : [];
        this.notesByGroups = [];
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
      });
    this.dragulaSubscription =
      this.dragulaService.drop.subscribe((value) => {
      const destination = value[2];
      const source = value[3];

      if (source.childElementCount < 2) {
        source.remove();
      }

      this.saveTitle(destination.children[0]);
    });
  }

  saveTitle(inputTitle) {
    const title = inputTitle.value;
    const group = inputTitle.parentElement;
    const groupNotesElements = group.querySelectorAll('.note');
    const groupNotes = Array.from(groupNotesElements, (groupNoteElement: HTMLElement) => groupNoteElement.innerText.trim());
    this.notes.forEach(function(note) {
      if (groupNotes.indexOf(note.text) > -1) {
        note.group = title;
      }
    });
    this.document.update({ notes: this.notes });
  }

  ngOnDestroy() {
    this.notesSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.dragulaSubscription.unsubscribe();
  }
}
