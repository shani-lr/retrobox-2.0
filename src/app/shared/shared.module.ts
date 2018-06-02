import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ErrorPageComponent } from './error-page/error-page.component';
import { DataService } from './data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    ErrorPageComponent
  ],
  providers: [
    DataService
  ],
  exports: [
    ErrorPageComponent,
    FormsModule,
    NgbModule
  ]
})
export class SharedModule { }
