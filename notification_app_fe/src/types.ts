export interface Notification {
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
  isRead?: boolean;
}

export interface NotificationsResponse {
  notifications?: Notification[];
}
