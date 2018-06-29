import { Component, Input } from '@angular/core';

import { Alert } from '../../core/models/alert.model';

@Component({
  selector: 'app-alert',
  template: `
    <div class="row">
      <div class="col">
        <ng-container *ngIf="alert">
          <div class="alert" [ngClass]="alert.styleClass" role="alert">
            <i class="fas" [ngClass]="alert.iconClass"></i> {{alert.message}}
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class AlertComponent {

  @Input() alert: Alert;

}
