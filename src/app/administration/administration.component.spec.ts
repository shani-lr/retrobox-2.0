import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AdministrationComponent } from './administration.component';
import { DataService } from '../shared/services/data.service';
import { DataServiceMock } from '../testing/data.service.mock';
import { TeamServiceMock } from '../testing/team.service.mock';
import { TeamService } from '../shared/services/team.service';
import { AppServiceMock } from '../testing/app.service.mock';
import { AppService } from '../shared/services/app.service';
import { ResultsComponent } from '../vote/results/results.component';
import { AlertType } from '../shared/models/alert.model';
import { appState } from '../testing/app.state.mock';

describe('AdministrationComponent', () => {
  let component: AdministrationComponent;
  let fixture: ComponentFixture<AdministrationComponent>;
  let dataServiceMock: DataServiceMock;
  let teamServiceMock: TeamServiceMock;
  let appServiceMock: AppServiceMock;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'vote-results', component: ResultsComponent}])
      ],
      declarations: [
        AdministrationComponent,
        ResultsComponent
      ],
      providers: [
        {provide: DataService, useClass: DataServiceMock},
        {provide: TeamService, useClass: TeamServiceMock},
        {provide: AppService, useClass: AppServiceMock}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationComponent);
    location = TestBed.get(Location);
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

  it('should be initialized correctly', () => {
    // assert
    expect(component.appState).toBe(appState);
    expect(component.isVotingOn).toBe(teamServiceMock.isVotingOn);
    expect(component.nonAdminTeamMembers).toBe(teamServiceMock.nonAdminUsers);
    expect(component.currentSprint).toBe(teamServiceMock.currentSprint);
  });

  it('should successfully create new sprint', () => {
    // arrange
    const updateTeamSpy = spyOn(dataServiceMock, 'updateTeam').and.callThrough();

    // act
    component.createNewSprint();

    // assert
    expect(updateTeamSpy).toHaveBeenCalledWith(appState.team.name, teamServiceMock.teamDataWithNewSprint);
    expect(component.alert.type).toBe(AlertType.Success);
  });

  it('should successfully add new admin', () => {
    // arrange
    component.isAddAdminSelected = true;
    component.newAdmin = appServiceMock.newAdmin;
    const updateApplicationSpy = spyOn(dataServiceMock, 'updateApplication').and.callThrough();
    const getNonAdminTeamMembersSpy = spyOn(teamServiceMock, 'getNonAdminTeamMembers').and.callThrough();

    // act
    component.addAdmin();

    // assert
    expect(updateApplicationSpy).toHaveBeenCalledWith(appServiceMock.appWithUpdatedTeamAdmins);
    expect(component.alert.type).toBe(AlertType.Success);
    expect(component.isAddAdminSelected).toBeFalsy();
    expect(component.newAdmin).toBe('');
    expect(getNonAdminTeamMembersSpy).toHaveBeenCalledTimes(1);
  });

  it('should successfully open vote', () => {
    // arrange
    const updateApplicationSpy = spyOn(dataServiceMock, 'updateApplication').and.callThrough();

    // act
    component.openVote();

    // assert
    expect(updateApplicationSpy).toHaveBeenCalledWith(appServiceMock.appWithUpdatedVoteOn);
    expect(component.alert.type).toBe(AlertType.Success);
    expect(component.alert.message).toContain('open');
  });

  it('should successfully close vote', () => {
    // arrange
    const updateApplicationSpy = spyOn(dataServiceMock, 'updateApplication').and.callThrough();

    // act
    component.closeVote();

    // assert
    expect(updateApplicationSpy).toHaveBeenCalledWith(appState.app);
    expect(component.alert.type).toBe(AlertType.Success);
    expect(component.alert.message).toContain('close');
  });

  it('should successfully navigate to show results', fakeAsync(() => {
    // act
    component.onShowResults();
    tick();
    // assert
    expect(location.path()).toBe('/vote-results');
  }));

});
