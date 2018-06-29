import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../../shared/data.service';
import { AppUser } from '../../core/models/user.model';
import { Note } from '../../core/models/note.model';
import { AppState } from '../../core/models/app-state.model';
import { TeamData } from '../../core/models/team.model';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit, OnDestroy {
  showErrorMessage: boolean;
  voteSubmitted: boolean;
  notesByItems: { item: string, notes: Note[], votes: number }[] = [];
  hasVoted: boolean;
  private totalVotes = 3;
  private user: AppUser;
  private team: TeamData;
  private sprint = '';
  private notes: Note[];
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.dataService.getAppState().subscribe((appState: AppState) => {
        this.user = appState.user;
        this.team = appState.teamData;
        if (this.team && this.team.sprints) {
          this.sprint = this.team.sprints[this.team.sprints.length - 1];
          this.notes = this.team && this.team[this.sprint] ? this.team[this.sprint] : [];
          this.notesByItems = [];
          this.mapNotesToItems();
          this.populateVotes();
        }
      }));
  }

  addVote(notesByItem: { item: string; notes: Note[]; votes: number }) {
    if (this.totalVotes) {
      notesByItem.votes = notesByItem.votes + 1;
      this.totalVotes = this.totalVotes - 1;
    } else {
      this.showErrorMessage = true;
    }
  }

  onDiscard() {
    this.notesByItems.forEach(noteByItem => noteByItem.votes = 0);
    this.totalVotes = 3;
    this.showErrorMessage = false;
    this.team.vote = this.team.vote.filter(item => item.user !== this.user.name);
    this.subscriptions.push(this.dataService.updateTeam(this.user.team, this.team).subscribe());
  }

  onSubmitVote() {
    this.notesByItems.forEach(noteByItem => {
      if (noteByItem.votes) {
        this.team.vote.push({item: noteByItem.item, votes: noteByItem.votes, user: this.user.name});
      }
    });

    this.subscriptions.push(this.dataService.updateTeam(this.user.team, this.team).subscribe(() => this.voteSubmitted = true));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private mapNotesToItems() {
    this.mapNotesToNoteItems();
  }

  private mapNotesToCategories() {
    this.notes.map(note => {
      if (note.group) {
        const groupIndex = this.notesByItems.map(x => x.item).indexOf(note.group);
        if (groupIndex > -1) {
          this.notesByItems[groupIndex].notes.push(
            {text: note.text, by: note.by, group: note.group, at: note.at});
        } else {
          this.notesByItems.push({
            item: note.group,
            notes: [{text: note.text, by: note.by, group: note.group, at: note.at}],
            votes: 0
          });
        }
      }
    });
  }

  private mapNotesToNoteItems() {
    this.notes.map(note => {
      this.notesByItems.push({
        item: note.text,
        notes: [{text: note.text, by: note.by, group: note.group, at: note.at}],
        votes: 0
      });
    });

  }

  private populateVotes() {
    this.team.vote.forEach((userVote: { item: string, votes: number, user: string }) => {
      if (userVote.user === this.user.name) {
        this.hasVoted = true;
        const itemIndex = this.notesByItems.map(x => x.item).indexOf(userVote.item);
        this.notesByItems[itemIndex].votes = userVote.votes;
      }
    });
  }
}
