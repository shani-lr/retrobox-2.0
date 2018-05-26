import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetroComponent } from './retro.component';
import { DragulaModule } from 'ng2-dragula';
import { OldRetrosComponent } from './old-retros/old-retros.component';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule
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
