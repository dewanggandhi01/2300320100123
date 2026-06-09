export interface Notification {
  id: string;
  type: "Placement" | "Result" | "Event";
  message: string;
  createdAt: string;
}