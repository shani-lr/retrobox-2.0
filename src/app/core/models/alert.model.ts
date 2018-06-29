export interface Alert {
  message: string;
  type: AlertType;
  styleClass: string;
  iconClass: string;
}

export enum AlertType {
  Success,
  Danger,
  Info,
  Warning
}
