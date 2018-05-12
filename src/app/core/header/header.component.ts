import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router} from '@angular/router';
import { User } from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAdmin: boolean;
  user: User;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.authState.subscribe(res => {
      this.user = res;
      this.isAdmin = this.user && res.displayName === 'Shani Laster';
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
