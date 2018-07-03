import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AdminGuard } from './guards/admin.guard';
import { AuthService } from './auth.service';
import { AuthorizationGuard } from './guards/authorization.guard';
import { LoginAdminComponent } from './login/login-admin.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LoginAdminComponent
  ],
  providers: [
    AuthService,
    AuthenticationGuard,
    AuthorizationGuard,
    AdminGuard
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthModule { }
