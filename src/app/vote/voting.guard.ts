import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../shared/services/data.service';
import { AppState } from '../shared/models/app-state.model';
import { TeamService } from '../shared/services/team.service';

@Injectable()
export class VotingGuard implements CanActivate  {

  constructor(private dataService: DataService, private teamService: TeamService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.dataService.getAppState().map((appState: AppState) => {
      const isVotingOn = !!appState && this.teamService.getIsVotingOn(appState.team);
      if (!isVotingOn) {
        this.router.navigate(['/']);
      }
      return isVotingOn;
    });
  }

}
