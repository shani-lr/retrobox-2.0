import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyNotesComponent } from './my-notes/my-notes.component';
import { HomeComponent } from './core/home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-notes', component: MyNotesComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
