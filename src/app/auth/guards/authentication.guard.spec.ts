import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { AuthenticationGuard } from './authentication.guard';
import { AuthService } from '../auth.service';
import { LoginComponent } from '../login/login.component';
import { AuthServiceMock } from '../../../testing/auth.service.mock';

describe('AuthenticationGuard', () => {
  let authenticationGuard: AuthenticationGuard;
  let authServiceMock: AuthServiceMock;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationGuard,
        { provide: AuthService, useClass: AuthServiceMock }
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'login', component: LoginComponent}])
      ],
      declarations: [
        LoginComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    authenticationGuard = TestBed.get(AuthenticationGuard);
    location = TestBed.get(Location);
    authServiceMock = TestBed.get(AuthService);
  });

  it('should be created', () => {
    // assert
    expect(authenticationGuard).toBeTruthy();
  });

  it('should be able to activate when user logged in', () => {
    // arrange
    spyOn(authServiceMock, 'isLoggedIn').and.returnValue(Observable.of(true));

    // act
    const canActivate$: Observable<boolean> = authenticationGuard.canActivate();

    // assert
    canActivate$.subscribe((canActivate: boolean) => {
      expect(canActivate).toBeTruthy();
    });
  });


  it('should not be able to activate when user not logged in and redirect to /login', fakeAsync(() => {
    // arrange
    spyOn(authServiceMock, 'isLoggedIn').and.returnValue(Observable.of(false));

    // act
    const canActivate$: Observable<boolean> = authenticationGuard.canActivate();

    // assert
    canActivate$.subscribe((canActivate: boolean) => {
      expect(canActivate).toBeFalsy();
      tick();
      expect(location.path()).toBe('/login');
    });
  }));
});
