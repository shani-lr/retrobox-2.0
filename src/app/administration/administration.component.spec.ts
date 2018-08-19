import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AdministrationComponent } from './administration.component';
import { DataService } from '../shared/services/data.service';
import { TeamService } from '../shared/services/team.service';
import { AppService } from '../shared/services/app.service';
import { ResultsComponent } from '../vote/results/results.component';
import { DataServiceMock } from '../../testing/data.service.mock';
import { TeamServiceMock } from '../../testing/team.service.mock';
import { AppServiceMock } from '../../testing/app.service.mock';
import { testData } from '../../testing/test-data';
import { AlertType } from '../shared/models/alert.model';

describe('AdministrationComponent', () => {
  let component: AdministrationComponent;
  let fixture: ComponentFixture<AdministrationComponent>;
  let dataServiceMock: DataService;
  let teamServiceMock: TeamService;
  let appServiceMock: AppService;
  let location: Location;
  let getIsVotingOnSpy: jasmine.Spy;
  let getNonAdminTeamMembersSpy: jasmine.Spy;
  let getCurrentSprintSpy: jasmine.Spy;

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

    spyOn(dataServiceMock, 'getAppState').and.returnValue(Observable.of(testData.appState));
    getIsVotingOnSpy = spyOn(teamServiceMock, 'getIsVotingOn').and.returnValue(true);
    getNonAdminTeamMembersSpy = spyOn(teamServiceMock, 'getNonAdminTeamMembers').and.returnValue(testData.nonAdminTeamMembers);
    getCurrentSprintSpy = spyOn(teamServiceMock, 'getCurrentSprint').and.returnValue('1002');

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
    expect(component.appState).toBe(testData.appState);
    expect(component.isVotingOn).toBeTruthy();
    expect(component.nonAdminTeamMembers).toBe(testData.nonAdminTeamMembers);
    expect(component.currentSprint).toBe('1002');
  });

  it('should create sprint successfully', () => {
    // arrange
    const getTeamDataWithNewSprintSpy = spyOn(teamServiceMock, 'getTeamDataWithNewSprint')
      .and.returnValue(testData.teamDataWithNewSprint);
    const updateTeamSpy = spyOn(dataServiceMock, 'updateTeam')
      .and.returnValue(Observable.of({}));

    // act
    component.createNewSprint();

    // assert
    expect(getTeamDataWithNewSprintSpy).toHaveBeenCalledWith('1003', testData.appState.teamData);
    expect(updateTeamSpy).toHaveBeenCalledWith(testData.appState.team.name, testData.teamDataWithNewSprint);
    expect(component.alert.type).toBe(AlertType.Success);
  });

  it('should create admin successfully', () => {
    // arrange
    const getAppWithUpdatedTeamAdminsSpy = spyOn(appServiceMock, 'getAppWithUpdatedTeamAdmins')
      .and.returnValue(testData.appWithUpdatedTeamAdmins);
    const updateApplicationSpy = spyOn(dataServiceMock, 'updateApplication')
      .and.returnValue(Observable.of({}));
    getNonAdminTeamMembersSpy.and.returnValue(testData.newNonAdminTeamMembers);
    component.newAdmin = 'Charlie Perl';
    component.isAddAdminSelected = true;

    // act
    component.addAdmin();

    // assert
    expect(getAppWithUpdatedTeamAdminsSpy).toHaveBeenCalledWith(testData.appState.app, testData.appState.team, 'Charlie Perl');
    expect(updateApplicationSpy).toHaveBeenCalledWith(testData.appWithUpdatedTeamAdmins);
    expect(component.alert.type).toBe(AlertType.Success);
    expect(component.isAddAdminSelected).toBeFalsy();
    expect(component.newAdmin).toBe('');
    expect(component.nonAdminTeamMembers).toBe(testData.newNonAdminTeamMembers);
  });

  it('should open vote successfully', () => {
    // arrange
    const getAppWithUpdatedTeamVoteSpy =
      spyOn(appServiceMock, 'getAppWithUpdatedTeamVote').and.returnValue(testData.appWithUpdatedTeamVoteOpen);
    const updateApplicationSpy =
      spyOn(dataServiceMock, 'updateApplication').and.returnValue(Observable.of({}));

    // act
    component.openVote();

    // assert
    expect(getAppWithUpdatedTeamVoteSpy).toHaveBeenCalledWith(testData.appState.app, testData.appState.team, true);
    expect(updateApplicationSpy).toHaveBeenCalledWith(testData.appWithUpdatedTeamVoteOpen);
    expect(component.alert.type).toBe(AlertType.Success);
    expect(component.alert.message).toContain('open');
  });

  it('should close vote successfully', () => {
    // arrange
    const getAppWithUpdatedTeamVoteSpy =
      spyOn(appServiceMock, 'getAppWithUpdatedTeamVote')
        .and.returnValues(testData.appWithUpdatedTeamVoteOpen, testData.appState.app);
    const updateApplicationSpy =
      spyOn(dataServiceMock, 'updateApplication').and.returnValue(Observable.of({}));

    // act
    component.openVote();
    component.closeVote();

    // assert
    expect(getAppWithUpdatedTeamVoteSpy).toHaveBeenCalledWith(testData.appState.app, testData.appState.team, true);
    expect(getAppWithUpdatedTeamVoteSpy).toHaveBeenCalledWith(testData.appState.app, testData.appState.team, false);
    expect(updateApplicationSpy).toHaveBeenCalledWith(testData.appWithUpdatedTeamVoteOpen);
    expect(updateApplicationSpy).toHaveBeenCalledWith(testData.appState.app);
    expect(component.alert.type).toBe(AlertType.Success);
    expect(component.alert.message).toContain('close');

  });

  it('should successfully navigate to results page', fakeAsync(() => {
    // arrange

    // act
    component.onShowResults();
    tick();

    // assert
    expect(location.path ()).toBe('/vote-results');
  }));


});
