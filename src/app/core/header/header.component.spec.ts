import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthServiceMock } from '../../testing/auth.service.mock';
import { DataServiceMock } from '../../testing/data.service.mock';
import { PermissionsServiceMock } from '../../testing/permissions.service.mock';
import { TeamServiceMock } from '../../testing/team.service.mock';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../shared/services/data.service';
import { PermissionsService } from '../../shared/services/permissions.service';
import { TeamService } from '../../shared/services/team.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: AuthServiceMock;
  let dataServiceMock: DataServiceMock;
  let permissionsServiceMock: PermissionsServiceMock;
  let teamServiceMock: TeamServiceMock;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: '', component: HomeComponent}])
      ],
      declarations: [
        HeaderComponent,
        HomeComponent
      ],
      providers: [
        {provide: AuthService, useClass: AuthServiceMock},
        {provide: DataService, useClass: DataServiceMock},
        {provide: PermissionsService, useClass: PermissionsServiceMock},
        {provide: TeamService, useClass: TeamServiceMock}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    location = TestBed.get(Location);
    authServiceMock = TestBed.get(AuthService);
    dataServiceMock = TestBed.get(DataService);
    permissionsServiceMock = TestBed.get(PermissionsService);
    teamServiceMock = TestBed.get(TeamService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // assert
    expect(component).toBeTruthy();
  });

  it('should be initialized correctly when user not logged in', () => {
    // arrange
    authServiceMock.loggedIn = false;

    // act
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(component.isLoggedIn).toBeFalsy();
  });

  it('should be initialized correctly when user logged in', () => {
    // arrange
    authServiceMock.loggedIn = true;

    // act
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(component.isLoggedIn).toBeTruthy();
  });

  it('should be initialized correctly when user is registered', () => {
    // arrange
    permissionsServiceMock.registered = true;

    // act
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(component.isRegistered).toBeTruthy();
  });

  it('should be initialized correctly when user logged as admin', () => {
    // arrange
    permissionsServiceMock.admin = true;

    // act
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(component.isAdmin).toBeTruthy();
  });

  it('should be initialized correctly when user vote is on', () => {
    // arrange
    teamServiceMock.isVotingOn = true;

    // act
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(component.isVotingOn).toBeTruthy();
  });

  it('should successfully log in user', () => {
    // arrange
    authServiceMock.loggedIn = false;

    // act
    component.login();

    // assert
    expect(authServiceMock.loggedIn).toBeTruthy();
  });



  it('should successfully log user out and redirect to home', fakeAsync(() => {
    // arrange
    authServiceMock.loggedIn = true;

    // act
    component.logout();
    tick();

    // assert
    expect(component.isLoggedIn).toBeFalsy();
    expect(location.path()).toBe('/');
  }));

});
