import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService } from './data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    AlertComponent
  ],
  providers: [
    DataService
  ],
  exports: [
    AlertComponent,
    FormsModule,
    NgbModule
  ]
})
export class SharedModule { }
