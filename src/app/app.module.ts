import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { MyNotesComponent } from './my-notes/my-notes.component';
import { CoreModule } from './core/core.module';
import { environment } from '../environments/environment';
import { RetroComponent } from './retro/retro.component';
import { DragulaModule } from 'ng2-dragula';
import { CommonModule, DatePipe } from '@angular/common';

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
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
