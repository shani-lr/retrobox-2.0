import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

import { VotingComponent } from './voting/voting.component';
import { VotingGuard } from './voting.guard';
import { SharedModule } from '../shared/shared.module';
import { ResultsComponent } from './results/results.component';
import { ResultsService } from './results/results.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  declarations: [
    VotingComponent,
    ResultsComponent
  ],
  providers: [
    VotingGuard,
    ResultsService
  ],
  exports: [
    VotingComponent
  ]
})
export class VotingModule { }
