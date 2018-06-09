import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotingComponent } from './voting.component';
import { VotingGuard } from './voting.guard';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    VotingComponent
  ],
  providers: [
    VotingGuard
  ],
  exports: [
    VotingComponent
  ]
})
export class VotingModule { }
