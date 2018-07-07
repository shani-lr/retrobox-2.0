import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TeamData } from '../models/team.model';
import { MyNote, Note, NoteState } from '../models/note.model';
import { AppUser } from '../models/user.model';
import { Group } from '../models/group.model';

@Injectable()
export class NotesService {

  constructor(private datePipe: DatePipe) { }

  getNotes(teamData: TeamData, sprint: string): Note[] {
    if (teamData && sprint) {
      return teamData[sprint] || [];
    }
    return null;
  }

  getMyNotesWithNewNote(notes: Note[], user: AppUser): MyNote[] {
    if (notes && user) {
      const myNotes = this.getMyNotes(notes, user);
      return this.insertNewEmptyNote(myNotes, user);
    }
    return null;
  }

  getUpdatedNotes(notes: Note[], note: MyNote): Note[] {
    let updatedNotes;
    if (note.state === NoteState.New) {
      updatedNotes = this.getNotesWithNewNote(notes, note);
    } else if (note.state === NoteState.Edit) {
      updatedNotes = this.getNotesWithEditedNote(notes, note);
    } else if (note.state === NoteState.Deleted) {
      updatedNotes = this.getNotesWithoutNote(notes, note);
    }
    return updatedNotes;
  }

  mapNotesToGroups(notes: Note[]): Group[] {
    let groups = [];

    notes.map(note => {
      let groupIndex;
      if (note.group) {
        groupIndex = this.findGroupIndex(groups, note.group);
        if (groupIndex > -1) {
          groups[groupIndex].notes.push({...note});
          return;
        }
      }
      groups.push({group: note.group, notes: [{...note}]});
    });

    return groups;
  }

  getNotesWithUpdatedGroups(notes: Note[], groupNotes, title: string): Note[] {
    return notes.map((note: Note) => this.getNoteWithUpdatedGroup(groupNotes, note, title));
  }

  getMySelectedNotesText(notes: Note[], user: AppUser): string[] {
    if (notes && user) {
      return notes.filter(
        note => note.votingUsers && note.votingUsers.includes(user.name))
        .map(note => note.text);
    }
    return null;
  }

  getUpdatedNoteWithToggledVote(mySelectedNotesText: string[], notes: Note[], noteText: string, user: AppUser): Note {
    if (mySelectedNotesText && notes && noteText && user)
    {
      const note = notes.find(x => x.text === noteText);
      const shouldAddVote = this.shouldAddVote(mySelectedNotesText, note);
      return shouldAddVote ? this.addUserVoteToNote(note, user) : this.clearUserVoteFromNote(note, user);
    }
  }

  getNotesWithUpdatedNote(notes: Note[], updatedNote: Note): Note[] {
    const noteToUpdateIndex = this.findNoteIndex(notes, updatedNote);
    const updatedNotes = [...notes];
    updatedNotes[noteToUpdateIndex] = updatedNote;
    return updatedNotes;
  }

  shouldAddVote(mySelectedNotesText: string[], note: Note): boolean {
    return !mySelectedNotesText.includes(note.text);
  }

  private getMyNotes(notes: Note[], user: AppUser): MyNote[] {
    if (notes && user) {
      return notes.filter(note => note.by === user.name)
        .map(note => this.convertNoteToMyNote(note));
    }
    return null;
  }

  private convertNoteToMyNote(note: Note): MyNote {
    return {
      ...note,
      state: NoteState.Saved,
      updatedText: note.text
    }
  }

  private insertNewEmptyNote(notes: MyNote[], user: AppUser): MyNote[] {
    const newNote: MyNote = {
      text: '',
      by: user.name,
      at: '',
      group: '',
      state: NoteState.New,
      updatedText: '',
      votingUsers: []
    };
    return [newNote, ...notes];
  }

  private getNotesWithNewNote(notes: Note[], newNote: MyNote): Note[] {
    const noteToAdd = this.convertMyNoteToNote(newNote);
    return [...notes, noteToAdd];
  }

  private getNotesWithEditedNote(notes: Note[], note: MyNote): Note[] {
    const noteToEditIndex = this.findNoteIndex(notes, note);
    const updatedNote = this.convertMyNoteToNote(note);
    const updatedNotes = [...notes];
    updatedNotes[noteToEditIndex] = updatedNote;
    return updatedNotes;
  }

  private getNotesWithoutNote(notes: Note[], note: MyNote): Note[] {
    const noteToDeleteIndex = this.findNoteIndex(notes, note);
    const updatedNotes = [...notes];
    updatedNotes.splice(noteToDeleteIndex, 1);
    return updatedNotes;
  }

  private findNoteIndex(notes: Note[], note: Note) {
    return notes.findIndex(x =>
      x.by === note.by
      && x.at === note.at
      && x.text === note.text);
  }

  private convertMyNoteToNote(note: MyNote): Note {
    const date = this.datePipe.transform(new Date(), 'MMM d');
    return {
      text: note.updatedText,
      by: note.by,
      group: '',
      at: date,
      votingUsers: []
    };
  }

  private findGroupIndex(groups: Group[], groupName: string): number {
    return groups.map(x => x.group).indexOf(groupName);
  }

  private getNoteWithUpdatedGroup(groupNotes, note: Note, title: string): Note {
    const updatedNote = { ...note };
    if (groupNotes.indexOf(note.text) > -1) {
      updatedNote.group = title;
    }
    return updatedNote;
  }

  private clearUserVoteFromNote(note: Note, user: AppUser): Note {
    return {
      ...note,
      votingUsers: note.votingUsers.filter(x => x !== user.name)
    }
  }

  private addUserVoteToNote(note: Note, user: AppUser): Note {
    return {
      ...note,
      votingUsers: note.votingUsers ? [...note.votingUsers, user.name] : [user.name]
    }
  }
}
