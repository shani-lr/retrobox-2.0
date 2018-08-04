import { Observable } from 'rxjs/Observable';

export class AuthServiceMock {
  getLoggedInUserName(): Observable<string> {
    return undefined;
  }

  isLoggedIn(): Observable<boolean> {
    return undefined;
  }

  login(): Observable<any> {
    return undefined;
  }

  logout(): Observable<any> {
    return undefined;
  }

}
