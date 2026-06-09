import axios from "axios";
import dotenv from "dotenv";
import { Notification } from "../types/notification";

dotenv.config();

type ApiNotification = {
  id?: string;
  ID?: string;
  type?: Notification["type"];
  Type?: Notification["type"];
  message?: string;
  Message?: string;
  createdAt?: string;
  Timestamp?: string;
};

export async function fetchNotifications(): Promise<Notification[]> {
  const response = await axios.get(
    "http://4.224.186.213/evaluation-service/notifications",
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    }
  );

  const notifications = response.data.notifications || [];

  return notifications.map(
    (notification: ApiNotification, index: number) => ({
      id: notification.id || notification.ID || String(index),
      type: notification.type || notification.Type || "Event",
      message: notification.message || notification.Message || "",
      createdAt:
        notification.createdAt ||
        notification.Timestamp ||
        new Date(0).toISOString(),
    })
  );
}
