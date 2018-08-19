import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RegisterComponent } from './register.component';
import { DataService } from '../../shared/services/data.service';
import { TeamService } from '../../shared/services/team.service';
import { AppService } from '../../shared/services/app.service';
import { MyNotesComponent } from '../../my-notes/my-notes.component';
import { DataServiceMock } from '../../../testing/data.service.mock';
import { TeamServiceMock } from '../../../testing/team.service.mock';
import { AppServiceMock } from '../../../testing/app.service.mock';
import { AuthService } from '../auth.service';
import { AuthServiceMock } from '../../../testing/auth.service.mock';
import { testData } from '../../../testing/test-data';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: AuthService;
  let dataServiceMock: DataService;
  let teamServiceMock: TeamService;
  let appServiceMock: AppService;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'my-notes', component: MyNotesComponent}])
      ],
      declarations: [
        RegisterComponent,
        MyNotesComponent
      ],
      providers: [
        {provide: DataService, useClass: DataServiceMock},
        {provide: TeamService, useClass: TeamServiceMock},
        {provide: AppService, useClass: AppServiceMock},
        {provide: AuthService, useClass: AuthServiceMock}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    location = TestBed.get(Location);
    authServiceMock = TestBed.get(AuthService);
    dataServiceMock = TestBed.get(DataService);
    teamServiceMock = TestBed.get(TeamService);
    appServiceMock = TestBed.get(AppService);
    component = fixture.componentInstance;

    spyOn(dataServiceMock, 'getAppState').and.returnValue(Observable.of(testData.appState));
    spyOn(authServiceMock, 'getLoggedInUserName').and.returnValue(Observable.of(testData.loggedInUserName));
    fixture.detectChanges();
  });

  it('should create', () => {
    // arrange

    // act

    // assert
    expect(component).toBeTruthy();
  });

  it('should be initialized correctly', () => {
    // arrange

    // act

    // assert
    expect(component.userName).toBe(testData.loggedInUserName);
    expect(component.app).toBe(testData.appState.app);
  });

  it('should create team successfully', () => {
    // arrange
    let getTeamToCreateSpy = spyOn(teamServiceMock, 'getTeamToCreate')
      .and.returnValue(testData.teamToCreate);
    let getUpdatedApplicationWithTeamToCreateSpy = spyOn(appServiceMock, 'getUpdatedApplicationWithTeamToCreate')
      .and.returnValue(testData.updatedApplicationWithTeamToCreate);
    let updateApplicationSpy = spyOn(dataServiceMock, 'updateApplication')
      .and.returnValue(Observable.of({}));
    let getTeamToCreateDataSpy = spyOn(teamServiceMock, 'getTeamToCreateData')
      .and.returnValue(testData.teamToCreateData);
    let createTeamSpy = spyOn(dataServiceMock, 'createTeam')
      .and.returnValue(Observable.of({}));

    component.teamToCreateName = testData.teamToCreate.name;
    component.teamToCreateSprint = testData.teamToCreateData.sprints[0];

    // act
    component.createTeam();

    // assert
    expect(getTeamToCreateSpy).toHaveBeenCalledWith(testData.teamToCreate.name, testData.loggedInUserName);
    expect(getUpdatedApplicationWithTeamToCreateSpy).toHaveBeenCalledWith(testData.appState.app, testData.teamToCreate);
    expect(updateApplicationSpy).toHaveBeenCalledWith(testData.updatedApplicationWithTeamToCreate);
    expect(getTeamToCreateDataSpy).toHaveBeenCalledWith(testData.teamToCreateData.sprints[0]);
    expect(createTeamSpy).toHaveBeenCalledWith(testData.teamToCreate.name, testData.teamToCreateData);
    expect(component.showCreateTeam).toBeFalsy();
    expect(component.teamToJoin).toBe(testData.teamToCreate.name);
    expect(component.teamToCreateName).toBe('');
    expect(component.teamToCreateSprint).toBe('');
  });

  it('should add to team successfully', fakeAsync(() => {
    // arrange
    let getUpdatedApplicationWithUserToAddSpy =
      spyOn(appServiceMock, 'getUpdatedApplicationWithUserToAdd')
        .and.returnValue(testData.updatedApplicationWithUserToAdd);
    let updateApplicationSpy = spyOn(dataServiceMock, 'updateApplication')
      .and.returnValue(Observable.of({}));

    component.teamToJoin = testData.teamToJoin;

    // act
    component.onJoinTeam();
    tick();

    // assert
    expect(getUpdatedApplicationWithUserToAddSpy).toHaveBeenCalledWith(
      testData.appState.app, testData.loggedInUserName, testData.teamToJoin);
    expect(updateApplicationSpy).toHaveBeenCalledWith(testData.updatedApplicationWithUserToAdd);
    expect(location.path()).toBe('/my-notes');
  }))

});
