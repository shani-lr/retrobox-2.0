import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../shared/services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../shared/models/app-state.model';
import { PermissionsService } from '../../shared/services/permissions.service';
import { TeamService } from '../../shared/services/team.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isRegistered: boolean;
  isVotingOn: boolean;
  font: string;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private dataService: DataService,
              private permissionsService: PermissionsService, private teamService: TeamService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }));
    this.subscriptions.push(this.dataService.getAppState()
      .subscribe((appState: AppState) => {
        if (appState) {
          this.isRegistered = this.permissionsService.isRegistered(appState);
          this.isAdmin = this.permissionsService.isAdmin(appState);
          this.isVotingOn = this.teamService.getIsVotingOn(appState.team);
          this.font = appState.user.font
        }
      }));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
