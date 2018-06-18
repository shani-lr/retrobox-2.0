import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../../shared/data.service';
import { AppUser } from '../../core/models/user.model';
import { Note } from '../../core/models/note.model';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit, OnDestroy {
  showErrorMessage: boolean;
  voted: boolean;
  notesByItems: { item: string, notes: Note[], votes: number }[] = [];
  private totalVotes = 3;
  private user: AppUser;
  private team: { sprints: string[], vote: [{ item: string, votes: number, user: string }] };
  private sprint = '';
  private notes: Note[];
  private voteType: string;
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.dataService.getUser().subscribe(user => {
        this.user = user;
        this.subscriptions.push(this.dataService.getVoteType().subscribe(voteType => this.voteType = voteType));
        this.subscriptions.push(this.dataService.getTeam(this.user.team)
          .subscribe((doc: { sprints: string[], vote: [{ item: string, votes: number, user: string }] }) => {
            this.team = doc;
            if (this.team.sprints) {
              this.sprint = this.team.sprints[this.team.sprints.length - 1];
              this.notes = this.team && this.team[this.sprint] ? this.team[this.sprint] : [];
              this.notesByItems = [];
              this.mapNotesToItems();
            }
          }));
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
  }

  onVote() {
    this.notesByItems.forEach(noteByItem => {
      if (noteByItem.votes) {
        this.team.vote.push({item: noteByItem.item, votes: noteByItem.votes, user: this.user.name});
      }
    });
    this.subscriptions.push(this.dataService.updateTeam(this.user.team, this.team).subscribe(() => this.voted = true));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private mapNotesToItems() {
    if (this.voteType === 'category') {
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
    } else {
      this.notes.map(note => {
        this.notesByItems.push({
          item: `${note.text.substring(0, 30)}${note.text.length > 30 ? '...' : ''}`,
          notes: [{text: note.text, by: note.by, group: note.group, at: note.at}],
          votes: 0
        });
      });
    }
  }
}
