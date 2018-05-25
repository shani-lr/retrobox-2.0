import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-admin',
  template: `<app-error-page [errorMessage]="'You need to be logged in as team admin to see everyone\\'s notes.'"></app-error-page>`
})
export class LoginAdminComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userSubscription =
      this.authService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.router.navigate(['/retro']);
        }
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
