import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../shared/data.service';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../models/app-state.model';
import { PermissionsService } from '../../auth/permissions.service';
import { AdministrationService } from '../../administration/administration.service';

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
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    }));
    this.subscriptions.push(this.dataService.getAppState()
      .subscribe((appState: AppState) => {
        this.isRegistered = PermissionsService.isRegistered(appState);
        this.isAdmin = PermissionsService.isAdmin(appState);
        this.isVotingOn = AdministrationService.getIsVotingOn(appState);
      }));
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
