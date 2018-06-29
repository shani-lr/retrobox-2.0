import { Alert, AlertType } from '../../core/models/alert.model';

export class AlertConsts {
  static success: Alert = { type: AlertType.Success, styleClass: 'alert-success', iconClass: 'fa-check-circle', message: '' };
  static danger: Alert = { type: AlertType.Danger, styleClass: 'alert-danger', iconClass: 'fa-exclamation-circle', message: '' };
  static info: Alert = { type: AlertType.Info, styleClass: 'alert-info', iconClass: 'fa-info-circle', message: '' };
  static warning: Alert = { type: AlertType.Warning, styleClass: 'alert-warning', iconClass: 'fa-info-circle', message: '' };
}
