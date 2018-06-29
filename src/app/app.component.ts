import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {

  constructor(private angularFirestore: AngularFirestore) {
    const firestore = this.angularFirestore.firestore.settings({timestampsInSnapshots: true});
  }
}
