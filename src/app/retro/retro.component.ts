import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula';

import { Note } from '../shared/models/note.model';
import { DataService } from '../shared/services/data.service';
import { AppState } from '../shared/models/app-state.model';
import { Alert } from '../shared/models/alert.model';
import { AlertConsts } from '../shared/alert/alert.consts';
import { TeamService } from '../shared/services/team.service';
import { NotesService } from '../shared/services/notes.service';
import { Group } from '../shared/models/group.model';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.scss'],
  viewProviders: [DragulaService]
})
export class RetroComponent implements OnInit, OnDestroy {
  @Input() oldSprint: string;
  @Output() goBack = new EventEmitter();
  groups: Group[] = [];
  sprint = '';
  noTitleAlert: Alert;
  font: string;
  private notes: Note[];
  private appState: AppState;
  private subscriptions: Subscription[] = [];

  constructor(private dragulaService: DragulaService, private dataService: DataService,
              private teamService: TeamService, private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.configureDragula();

    this.subscriptions.push(
      this.dataService.getAppState().subscribe((appState: AppState) => {
        this.appState = appState;
        if (this.appState) {
          this.sprint = this.oldSprint || this.teamService.getCurrentSprint(this.appState.teamData);
          this.notes = this.notesService.getNotes(this.appState.teamData, this.sprint);
          this.groups = this.notesService.mapNotesToGroups(this.notes);
          this.font = this.appState.user.font;
        }
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private configureDragula(): void {
    this.dragulaService.setOptions('first-bag', {
      moves: (el, container, handle) => el.tagName !== 'INPUT',
      accepts: (el, target, source, sibling) => {
        if (source !== target) {
          const title = target.children[0].value;
          if (!title) {
            this.noTitleAlert = {
              ...AlertConsts.warning,
              message: 'Please enter a group title before grouping notes.'
            };
            setTimeout(() => this.noTitleAlert = null, 10000);
            return false;
          }
        }
        this.noTitleAlert = null;
        return true;
      }
    });

    this.subscriptions.push(
      this.dragulaService.drop.subscribe((value) => {
        const destination = value[2];
        const source = value[3];
        const titleInputElement = destination.children[0];
        if (this.shouldRemoveGroup(source)) {
          source.remove();
        }
        this.saveGroup(titleInputElement);
      }));
  }

  private shouldRemoveGroup(group): boolean {
    return group.childElementCount < 2;
  }

  private saveGroup(titleInputElement): void {
    const title = titleInputElement.value;
    const group = titleInputElement.parentElement;
    const groupNotesElements = group.querySelectorAll('.card-title');
    const groupNotes = Array.from(groupNotesElements,
      (groupNoteElement: HTMLElement) => groupNoteElement.textContent);

    const updatedNotes = this.notesService.getNotesWithUpdatedGroups(this.notes, groupNotes, title);

    const updatedTeamData =
      this.teamService.getTeamDataWithUpdatedNotes(this.appState.teamData, this.sprint, updatedNotes);

    this.subscriptions.push(
      this.dataService.updateTeam(this.appState.user.team, updatedTeamData).subscribe());
    this.noTitleAlert = null;
  }
}
