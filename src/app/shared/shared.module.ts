import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService } from './services/data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './alert/alert.component';
import { NotesService } from './services/notes.service';
import { TeamService } from './services/team.service';
import { AppService } from './services/app.service';
import { PermissionsService } from './services/permissions.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    NgbModule
  ],
  declarations: [
    AlertComponent
  ],
  providers: [
    DataService,
    NotesService,
    TeamService,
    AppService,
    PermissionsService
  ],
  exports: [
    AlertComponent,
    FormsModule,
    NgbModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
