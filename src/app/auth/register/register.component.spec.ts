import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { AuthServiceMock } from '../../testing/auth.service.mock';
import { AuthService } from '../auth.service';
import { MyNotesComponent } from '../../my-notes/my-notes.component';
import { DataServiceMock } from '../../testing/data.service.mock';
import { TeamServiceMock } from '../../testing/team.service.mock';
import { AppServiceMock } from '../../testing/app.service.mock';
import { DataService } from '../../shared/services/data.service';
import { TeamService } from '../../shared/services/team.service';
import { AppService } from '../../shared/services/app.service';
import { appState } from '../../testing/app.state.mock';
import { AlertType } from '../../shared/models/alert.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: AuthServiceMock;
  let dataServiceMock: DataServiceMock;
  let teamServiceMock: TeamServiceMock;
  let appServiceMock: AppServiceMock;
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
        {provide: AuthService, useClass: AuthServiceMock},
        {provide: DataService, useClass: DataServiceMock},
        {provide: TeamService, useClass: TeamServiceMock},
        {provide: AppService, useClass: AppServiceMock}
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
    fixture.detectChanges();
  });

  it('should create', () => {
    // assert
    expect(component).toBeTruthy();
  });

  it('should be initialized correctly when user logged in', () => {
    // arrange
    spyOn(dataServiceMock, 'getAppState').and.returnValue({
      ...appState,
      user: null,
      team: null,
      teamData: null
    });

    // assert
    expect(component.userName).toBe(authServiceMock.user);
    expect(component.app).toBe(appState.app);
    expect(component.showCreateTeam).toBeFalsy();
    expect(component.teamToJoin).toBe('');
    expect(component.teamToCreateSprint).toBe('');
    expect(component.teamToCreateName).toBe('');
  });


  it('should successfully create team', () => {
    // arrange
    component.showCreateTeam = true;
    component.teamToCreateName = teamServiceMock.teamToCreateName;
    component.teamToCreateSprint = teamServiceMock.newSprint;
    const updateApplicationSpy = spyOn(dataServiceMock, 'updateApplication').and.callThrough();
    const createTeamSpy = spyOn(dataServiceMock, 'createTeam').and.callThrough();

    // act
    component.createTeam();

    // assert
    expect(updateApplicationSpy).toHaveBeenCalledWith(appServiceMock.appWithNewTeam);
    expect(createTeamSpy).toHaveBeenCalledWith(teamServiceMock.teamToCreateName, teamServiceMock.teamToCreateData);
    expect(component.showCreateTeam).toBeFalsy();
    expect(component.teamToCreateName).toBe('');
    expect(component.teamToCreateSprint).toBe('');
    expect(component.teamToJoin).toBe(teamServiceMock.teamToCreateName);
    expect(component.registerAlert).toBeDefined();
    expect(component.registerAlert.type).toBe(AlertType.Info);
  });

  it('should allow user to join successfully to team', fakeAsync(() => {
    // arrange
    component.teamToJoin = appState.team.name;
    const updateApplicationSpy = spyOn(dataServiceMock, 'updateApplication').and.callThrough();

    // act
    component.onJoinTeam();
    tick();

    // assert
    expect(updateApplicationSpy).toHaveBeenCalledWith(appServiceMock.appWithNewUser);
    expect(location.path()).toBe('/my-notes');
  }));
});
