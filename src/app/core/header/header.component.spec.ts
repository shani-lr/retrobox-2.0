import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../shared/services/data.service';
import { TeamService } from '../../shared/services/team.service';
import { PermissionsService } from '../../shared/services/permissions.service';
import { MyNotesComponent } from '../../my-notes/my-notes.component';
import { RetroComponent } from '../../retro/retro.component';
import { VotingComponent } from '../../vote/voting/voting.component';
import { OldRetrosComponent } from '../../retro/old-retros/old-retros.component';
import { AdministrationComponent } from '../../administration/administration.component';
import { HomeComponent } from '../home/home.component';
import { DataServiceMock } from '../../../testing/data.service.mock';
import { TeamServiceMock } from '../../../testing/team.service.mock';
import { PermissionsServiceMock } from '../../../testing/permissions.service.mock';
import { AuthServiceMock } from '../../../testing/auth.service.mock';
import { Observable } from 'rxjs/Observable';
import { testData } from '../../../testing/test-data';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: AuthService;
  let dataServiceMock: DataService;
  let teamServiceMock: TeamService;
  let permissionsServiceMock: PermissionsService;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: HomeComponent },
          { path: 'my-notes', component: MyNotesComponent },
          { path: 'retro', component: RetroComponent },
          { path: 'vote', component: VotingComponent },
          { path: 'old-retros', component: OldRetrosComponent },
          { path: 'administration', component: AdministrationComponent },
        ])
      ],
      declarations: [
        HeaderComponent,
        HomeComponent,
        MyNotesComponent,
        RetroComponent,
        VotingComponent,
        OldRetrosComponent,
        AdministrationComponent
      ],
      providers: [
        {provide: DataService, useClass: DataServiceMock},
        {provide: TeamService, useClass: TeamServiceMock},
        {provide: PermissionsService, useClass: PermissionsServiceMock},
        {provide: AuthService, useClass: AuthServiceMock}
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
    teamServiceMock = TestBed.get(TeamService);
    permissionsServiceMock = TestBed.get(PermissionsService);
    component = fixture.componentInstance;

    spyOn(authServiceMock, 'isLoggedIn').and.returnValue(Observable.of(true));
    spyOn(dataServiceMock, 'getAppState').and.returnValue(Observable.of(testData.appState));
    spyOn(permissionsServiceMock, 'isRegistered').and.returnValue(true);
    spyOn(permissionsServiceMock, 'isAdmin').and.returnValue(true);
    spyOn(teamServiceMock, 'getIsVotingOn').and.returnValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    // arrange

    // act

    // assert
    expect(component).toBeTruthy();
  });

});
