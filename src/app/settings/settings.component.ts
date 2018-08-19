import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../shared/models/app-state.model';
import { DataService } from '../shared/services/data.service';
import { AppService } from '../shared/services/app.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  fonts = ['open-sans', 'indie-flower'];
  font = '';
  appState: AppState;
  private subscriptions = [];

  constructor(private dataService: DataService,
              private appService: AppService) { }

  ngOnInit() {
    this.font = this.fonts[0];

    this.subscriptions.push(
      this.dataService.getAppState().subscribe((appState: AppState) => {
        this.appState = appState;
        if (this.appState && this.appState.user && this.appState.user.font) {
          this.font = this.appState.user.font;
        }
      }));
  }

  onFontChange() {
    const updatedUser = {
      ...this.appState.user,
      font: this.font
    };

    const updatedApplicationWithUserToUpdate =
      this.appService.getUpdatedApplicationWithUserToUpdate(this.appState.app, updatedUser);

    this.subscriptions.push(
      this.dataService.updateApplication(updatedApplicationWithUserToUpdate).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe);
  }
}
