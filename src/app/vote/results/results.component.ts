import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../shared/data.service';
import { AppUser } from '../../core/models/user.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, OnDestroy {

  view: any[] = [1000, 500];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Votes';
  showYAxisLabel = true;
  yAxisLabel = 'Subject';
  colorScheme = {
    domain: ['#0796ae', '#00bfd1', '#55e0d9', '#a7e790', '#e1fbae']
  };
  results: { name: string, value: number }[] = [];
  private subscriptions: Subscription[] = [];
  private user: AppUser;
  private team: { sprints: string[]; vote: [{ item: string; votes: number; user: string }] };

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.dataService.getUser().subscribe(user => {
        this.user = user;
        this.subscriptions.push(this.dataService.getTeam(this.user.team)
          .subscribe((doc: { sprints: string[], vote: [{ item: string, votes: number, user: string }] }) => {
            this.team = doc;
            this.calculateVotes();
          }));
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private calculateVotes() {
    this.team.vote.map((userVote: { item: string, votes: number, user: string }) => {
      const groupIndex = this.results.map(x => x.name).indexOf(userVote.item);
      if (groupIndex > -1) {
        this.results[groupIndex].value = (+this.results[groupIndex].value) + userVote.votes;
      } else {
        this.results.push({name: userVote.item, value: userVote.votes});
      }
    });
    this.results = [...this.results];
  }


}
