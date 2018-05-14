import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { MyNotesComponent } from './my-notes/my-notes.component';
import { CoreModule } from './core/core.module';
import { environment } from '../environments/environment';
import { RetroComponent } from './retro/retro.component';


@NgModule({
  declarations: [
    AppComponent,
    MyNotesComponent,
    RetroComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    DragulaModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbModule.forRoot()
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
