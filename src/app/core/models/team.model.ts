export interface Team {
  name: string;
  admins: string[];
}

export interface TeamExtended extends Team {
  sprint: string;
}
