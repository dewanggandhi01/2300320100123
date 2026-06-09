import { useEffect, useState } from "react";
import axios from "axios";
import NotificationCard from "../components/NotificationCard";
import type { Notification, NotificationsResponse } from "../types";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || "YOUR_TOKEN";

export default function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get<NotificationsResponse>(API_URL, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });

        setNotifications(res.data.notifications || []);
        setError("");
      } catch (err) {
        setError("Unable to load notifications. Please check your access token.");
        console.error(err);
      }
    }

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>All Notifications</h2>

      {error && <p className="error-message">{error}</p>}

      {notifications.map((n, index) => (
        <NotificationCard
          key={index}
          notification={n}
        />
      ))}
    </div>
  );
}
