import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class AuthServiceMock {
  loggedIn = false;
  user = 'Shani Laster';

  isLoggedIn(): Observable<boolean> {
    return Observable.of(this.loggedIn);
  }

  login(): Observable<any> {
    this.loggedIn = true;
    return undefined;
  }

  logout(): Observable<any> {
    this.loggedIn = false;
    return undefined;
  }

  getLoggedInUserName(): Observable<string> {
    return Observable.of(this.user);
  }

}
