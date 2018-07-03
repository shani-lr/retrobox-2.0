import { Team } from './team.model';
import { AppUser } from './user.model';

export interface App {
  teams: Team[];
  users: AppUser[];
}
