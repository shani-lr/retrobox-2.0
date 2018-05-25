export interface Team {
  name: string;
  admin: string;
}

export interface TeamExtended extends Team {
  sprint: string;
}
