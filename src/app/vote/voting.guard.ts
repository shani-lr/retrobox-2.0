import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../shared/data.service';

@Injectable()
export class VotingGuard implements CanActivate  {

  constructor(private dataService: DataService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.dataService.isVotingOn().map((isVotingOn: boolean) => {
      if (!isVotingOn) {
        this.router.navigate(['/']);
      }
      return isVotingOn;
    });
  }

}
