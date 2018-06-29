import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationComponent } from './administration.component';
import { SharedModule } from '../shared/shared.module';
import { AdministrationService } from './administration.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AdministrationComponent
  ],
  providers: [
    AdministrationService
  ]
})
export class AdministrationModule { }
