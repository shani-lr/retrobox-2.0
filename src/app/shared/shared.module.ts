import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ErrorPageComponent } from './error-page/error-page.component';
import { DataService } from './data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ErrorPageComponent
  ],
  providers: [
    DataService
  ],
  exports: [
    ErrorPageComponent,
    FormsModule
  ]
})
export class SharedModule { }
