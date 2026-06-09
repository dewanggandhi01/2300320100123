import { useEffect, useState } from "react";
import axios from "axios";
import NotificationCard from "../components/NotificationCard";
import type { Notification, NotificationsResponse } from "../types";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || "YOUR_TOKEN";

export default function PriorityNotifications() {
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

        const data = res.data.notifications || [];

        const priorityMap: Record<Notification["Type"], number> = {
          Placement: 3,
          Result: 2,
          Event: 1,
        };

        const top10 = [...data]
          .sort((a, b) => {
            const p =
              priorityMap[b.Type] -
              priorityMap[a.Type];

            if (p !== 0) return p;

            return (
              new Date(b.Timestamp).getTime() -
              new Date(a.Timestamp).getTime()
            );
          })
          .slice(0, 10);

        setNotifications(top10);
        setError("");
      } catch (err) {
        setError("Unable to load priority notifications. Please check your access token.");
        console.error(err);
      }
    }

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Priority Notifications</h2>

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
