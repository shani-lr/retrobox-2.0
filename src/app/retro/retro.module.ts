import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetroComponent } from './retro.component';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule
  ],
  declarations: [
    RetroComponent
  ],
  exports: [
    RetroComponent
  ]
})
export class RetroModule { }
