import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { AdminGuard } from './admin.guard';
import { DataService } from '../../shared/services/data.service';
import { PermissionsService } from '../../shared/services/permissions.service';
import { LoginAdminComponent } from '../login/login-admin.component';
import { DataServiceMock } from '../../../testing/data.service.mock';
import { PermissionsServiceMock } from '../../../testing/permissions.service.mock';
import { testData } from '../../../testing/test-data';

describe('AdminGuard', () => {
  let adminGuard: AdminGuard;
  let dataServiceMock: DataServiceMock;
  let permissionsServiceMock: PermissionsServiceMock;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: DataService, useClass: DataServiceMock },
        { provide: PermissionsService, useClass: PermissionsServiceMock },
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'login-admin', component: LoginAdminComponent}])
      ],
      declarations: [
        LoginAdminComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    adminGuard = TestBed.get(AdminGuard);
    location = TestBed.get(Location);
    dataServiceMock = TestBed.get(DataService);
    permissionsServiceMock = TestBed.get(PermissionsService);
  });

  it('should be created', () => {

    // assert
    expect(adminGuard).toBeTruthy();
  });

  it('should be able to activate when user logged as admin', () => {
    // arrange
    spyOn(dataServiceMock, 'getAppState').and.returnValue(Observable.of(testData.appState));
    spyOn(permissionsServiceMock, 'isRegistered').and.returnValue(true);
    spyOn(permissionsServiceMock, 'isAdmin').and.returnValue(true);

    // act
    const canActivate$: Observable<boolean> = adminGuard.canActivate();

    // assert
    canActivate$.subscribe((canActivate: boolean) => {
      expect(canActivate).toBeTruthy();
    });

  });

  it('should not be able to activate when user not logged as admin and redirect to /login-admin', fakeAsync(() => {
    // arrange
    spyOn(dataServiceMock, 'getAppState').and.returnValue(Observable.of(testData.appState));
    spyOn(permissionsServiceMock, 'isRegistered').and.returnValue(true);
    spyOn(permissionsServiceMock, 'isAdmin').and.returnValue(false);

    // act
    const canActivate$: Observable<boolean> = adminGuard.canActivate();

    // assert
    canActivate$.subscribe((canActivate: boolean) => {
      expect(canActivate).toBeFalsy();
      tick();
      expect(location.path()).toBe('/login-admin');
    });

  }));
});
