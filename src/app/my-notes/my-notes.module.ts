import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MyNotesComponent } from './my-notes.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    MyNotesComponent
  ],
  providers: [
    DatePipe
  ],
  exports: [
    MyNotesComponent
  ]
})
export class MyNotesModule { }
