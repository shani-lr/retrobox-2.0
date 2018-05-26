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
  private isLoggedInSubscription: Subscription;
  private isAdminSubscription: Subscription;
  private isRegisteredSubscription: Subscription;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.isLoggedInSubscription =
      this.authService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
        this.isAdminSubscription =
          this.dataService.isAdmin().subscribe((isAdmin: boolean) => this.isAdmin = isAdmin);
        this.isRegisteredSubscription =
          this.dataService.isRegistered().subscribe((isRegistered: boolean) => this.isRegistered = isRegistered);
      });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
    if (this.isAdminSubscription) {
      this.isAdminSubscription.unsubscribe();
    }
    if (this.isRegisteredSubscription) {
      this.isRegisteredSubscription.unsubscribe();
    }
  }

}
