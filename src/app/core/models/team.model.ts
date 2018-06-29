import { Vote } from './vote.model';

export interface Team {
  name: string;
  admins: string[];
  vote: boolean;
}

export interface TeamData {
  sprints: string[];
  vote: Vote[];
}
