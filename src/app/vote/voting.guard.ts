import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../shared/data.service';
import { AppState } from '../core/models/app-state.model';

@Injectable()
export class VotingGuard implements CanActivate  {

  constructor(private dataService: DataService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.dataService.getAppState().map((appState: AppState) => {
      const isVotingOn = !!appState && !!appState.team && appState.team.vote;
      if (!isVotingOn) {
        this.router.navigate(['/']);
      }
      return isVotingOn;
    });
  }

}
