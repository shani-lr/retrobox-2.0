import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    HeaderComponent,
    HomeComponent
  ],
  providers: [
    AuthService
  ],
  exports: [
    AppRoutingModule,
    FormsModule,
    HeaderComponent
  ]
})
export class CoreModule { }
