import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../shared/data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isRegistered: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.subscriptions.push(this.authService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
        this.subscriptions.push(this.dataService.isAdmin().subscribe((isAdmin: boolean) => this.isAdmin = isAdmin));
        this.subscriptions.push(this.dataService.isRegistered().subscribe((isRegistered: boolean) => this.isRegistered = isRegistered));
      }));
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
