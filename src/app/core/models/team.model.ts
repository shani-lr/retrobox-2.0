export interface Team {
  vote: boolean;
  voteType: string;
  name: string;
  admins: string[];
}

export interface TeamExtended extends Team {
  sprint: string;
}
