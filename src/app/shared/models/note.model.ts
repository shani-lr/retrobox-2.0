export interface Note {
  text: string;
  by: string;
  at: string;
  group: string;
  votingUsers: string[];
}

export interface MyNote extends Note {
  state: NoteState;
  updatedText: string;
}

export enum NoteState {
  New,
  Edit,
  Saved,
  Deleted
}
