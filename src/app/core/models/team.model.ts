export interface Team {
  vote: boolean;
  name: string;
  admins: string[];
}

export interface TeamExtended extends Team {
  sprint: string;
}
