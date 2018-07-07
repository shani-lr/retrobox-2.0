import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from './auth.service';
import { AngularFireAuthMock } from '../testing/angular-fire-auth.mock';

describe('AdminGuard', () => {
  let authService: AuthService;
  let angularFireAuthMock: AngularFireAuthMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useClass: AngularFireAuthMock }
      ]
    });
  });

  beforeEach(() => {
    authService = TestBed.get(AuthService);
    angularFireAuthMock = TestBed.get(AngularFireAuth);
  });

  it('should be created', () => {
    // assert
    expect(authService).toBeTruthy();
  });

  it('should login user', () => {
    // arrange
    const firebaseAuth = angularFireAuthMock.auth;
    const signInWithPopupSpy = spyOn(firebaseAuth, 'signInWithPopup').and.callThrough();

    // act
    const login$ = authService.login();

    // assert
    login$.subscribe(() => {
      expect(signInWithPopupSpy).toHaveBeenCalled();
    });
  });

  it('should logout user', () => {
    // arrange
    const firebaseAuth = angularFireAuthMock.auth;
    const signOutSpy = spyOn(firebaseAuth, 'signOut').and.callThrough();

    // act
    const login$ = authService.logout();

    // assert
    login$.subscribe(() => {
      expect(signOutSpy).toHaveBeenCalled();
    });
  });

  it('should return true if user is logged in', () => {
    // act
    const isLoggedIn$ = authService.isLoggedIn();

    // assert
    isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      expect(isLoggedIn).toBeTruthy();
    });
  });

  it('should return true if user is logged in', () => {
    // arrange
    angularFireAuthMock.authState = Observable.of(undefined);

    // act
    const isLoggedIn$ = authService.isLoggedIn();

    // assert
    isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      expect(isLoggedIn).toBeFalsy();
    });
  });

  it('should successfully get logged in user name', () => {
    // act
    const getLoggedinUser$ = authService.getLoggedInUserName();

    // assert
    getLoggedinUser$.subscribe((userName: string) => {
      expect(userName).toBe(angularFireAuthMock.user);
    });
  });

  it('should return null when trying to get logged in user and user is not logged in', () => {
    // arrange
    angularFireAuthMock.authState = Observable.of(undefined);

    // act
    const getLoggedInUser$ = authService.getLoggedInUserName();

    // assert
    getLoggedInUser$.subscribe((userName: string) => {
      expect(userName).toBeNull();
    });
  });
});
