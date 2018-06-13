import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyNotesComponent } from './my-notes/my-notes.component';
import { HomeComponent } from './core/home/home.component';
import { RetroComponent } from './retro/retro.component';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { LoginComponent } from './auth/login/login.component';
import { AuthorizationGuard } from './auth/guards/authorization.guard';
import { RegisterComponent } from './auth/register/register.component';
import { AdminGuard } from './auth/guards/admin.guard';
import { LoginAdminComponent } from './auth/login/login-admin.component';
import { AdministrationComponent } from './administration/administration.component';
import { OldRetrosComponent } from './retro/old-retros/old-retros.component';
import { VotingComponent } from './vote/voting/voting.component';
import { VotingGuard } from './vote/voting.guard';
import { ResultsComponent } from './vote/results/results.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login-admin', component: LoginAdminComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthenticationGuard] },
  { path: 'my-notes', component: MyNotesComponent, canActivate: [AuthenticationGuard, AuthorizationGuard] },
  { path: 'retro', component: RetroComponent, canActivate: [AuthenticationGuard, AuthorizationGuard, AdminGuard] },
  { path: 'vote', component: VotingComponent, canActivate: [AuthenticationGuard, AuthorizationGuard, VotingGuard] },
  { path: 'vote-results', component: ResultsComponent, canActivate: [AuthenticationGuard, AuthorizationGuard] },
  { path: 'old-retros', component: OldRetrosComponent, canActivate: [AuthenticationGuard, AuthorizationGuard] },
  { path: 'administration', component: AdministrationComponent, canActivate: [AuthenticationGuard, AuthorizationGuard, AdminGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
