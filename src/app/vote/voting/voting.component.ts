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
  private totalVotes = 3;
  private subscriptions: Subscription[] = [];
  private user: AppUser;
  private team: { sprints: string[], vote: [{ group: string, votes: number, user: string }] };
  private sprint = '';
  private notes: Note[];
  private notesByGroups: { group: string, notes: Note[], votes: number }[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.dataService.getUser().subscribe(user => {
        this.user = user;
        this.subscriptions.push(this.dataService.getTeam(this.user.team)
          .subscribe((doc: { sprints: string[], vote: [{ group: string, votes: number, user: string }] }) => {
            this.team = doc;
            if (this.team.sprints) {
              this.sprint = this.team.sprints[this.team.sprints.length - 1];
              this.notes = this.team && this.team[this.sprint] ? this.team[this.sprint] : [];
              this.mapNotesToGroups();
            }
          }));
      }));
  }

  addVote(notesByGroup: { group: string; notes: Note[]; votes: number }) {
    if (this.totalVotes) {
      notesByGroup.votes = notesByGroup.votes + 1;
      this.totalVotes = this.totalVotes - 1;
    } else {
      this.showErrorMessage = true;
    }
  }

  onDiscard() {
    this.notesByGroups.forEach(noteByGroup => noteByGroup.votes = 0);
    this.totalVotes = 3;
    this.showErrorMessage = false;
  }

  onVote() {
    this.notesByGroups.forEach(noteByGroup => {
      if (noteByGroup.votes) {
        this.team.vote.push({group: noteByGroup.group, votes: noteByGroup.votes, user: this.user.name});
      }
    });
    this.subscriptions.push(this.dataService.updateTeam(this.user.team, this.team).subscribe(() => this.voted = true));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private mapNotesToGroups() {
    this.notes.map(note => {
      if (note.group) {
        const groupIndex = this.notesByGroups.map(x => x.group).indexOf(note.group);
        if (groupIndex > -1) {
          this.notesByGroups[groupIndex].notes.push(
            {text: note.text, by: note.by, group: note.group, at: note.at});
        } else {
          this.notesByGroups.push({
            group: note.group,
            notes: [{text: note.text, by: note.by, group: note.group, at: note.at}],
            votes: 0
          });
        }
      }
    });
  }
}
