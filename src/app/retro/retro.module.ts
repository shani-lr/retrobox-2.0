import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetroComponent } from './retro.component';
import { DragulaModule } from 'ng2-dragula';
import { OldRetrosComponent } from './old-retros/old-retros.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    SharedModule
  ],
  declarations: [
    RetroComponent,
    OldRetrosComponent
  ],
  exports: [
    RetroComponent
  ]
})
export class RetroModule { }
