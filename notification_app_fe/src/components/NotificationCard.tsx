import type { Notification } from "../types";

interface Props {
  notification: Notification;
}

export default function NotificationCard({ notification }: Props) {
  return (
    <article className="notification-card">
      <h3 className={notification.isRead ? "" : "unread"}>
        {notification.Type}
      </h3>

      <p>{notification.Message}</p>

      <time dateTime={notification.Timestamp}>
        {notification.Timestamp}
      </time>
    </article>
  );
}
