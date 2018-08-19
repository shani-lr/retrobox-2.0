import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { AuthorizationGuard } from './authorization.guard';
import { DataServiceMock } from '../../../testing/data.service.mock';
import { DataService } from '../../shared/services/data.service';
import { PermissionsService } from '../../shared/services/permissions.service';
import { PermissionsServiceMock } from '../../../testing/permissions.service.mock';
import { RegisterComponent } from '../register/register.component';
import { testData } from '../../../testing/test-data';

describe('AuthorizationGuard', () => {
  let authorizationGuard: AuthorizationGuard;
  let dataServiceMock: DataService;
  let permissionsServiceMock: PermissionsService;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationGuard,
        { provide: DataService, useClass: DataServiceMock },
        { provide: PermissionsService, useClass: PermissionsServiceMock }
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'register', component: RegisterComponent }])
      ],
      declarations: [
        RegisterComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    authorizationGuard = TestBed.get(AuthorizationGuard);
    location = TestBed.get(Location);
    dataServiceMock = TestBed.get(DataService);
    permissionsServiceMock = TestBed.get(PermissionsService);
  });

  it('should be created', () => {
    // assert
    expect(authorizationGuard).toBeTruthy();
  });

  it('should be able to activate when user is registered', () => {
    // arrange
    spyOn(dataServiceMock, 'getAppState').and.returnValue(Observable.of(testData.appState));
    spyOn(permissionsServiceMock, 'isRegistered').and.returnValue(true);

    // act
    const canActivate$: Observable<boolean> = authorizationGuard.canActivate();

    // assert
    canActivate$.subscribe((canActivate: boolean) => {
      expect(canActivate).toBeTruthy();
    });
  });

  it('should not be able to activate when user is not registered in and redirect to /register', fakeAsync(() => {
    // arrange
    spyOn(dataServiceMock, 'getAppState').and.returnValue(Observable.of(testData.appState));
    spyOn(permissionsServiceMock, 'isRegistered').and.returnValue(false);

    // act
    const canActivate$: Observable<boolean> = authorizationGuard.canActivate();

    // assert
    canActivate$.subscribe((canActivate: boolean) => {
      expect(canActivate).toBeFalsy();
      tick();
      expect(location.path()).toBe('/register');
    });
  }));
});
