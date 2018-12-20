import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  private subscriptions = [];

  constructor(private authService: AuthService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.router.navigate(['/notes']);
        }
      }));
  }

  googleLogin() {
    this.authService.googleLogin();
  }

  signUp() {
    this.authService.signup(this.email, this.password);
  }

  login() {
    this.authService.login(this.email, this.password);
  }

}
