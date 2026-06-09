import { Notification } from "../types/notification";
import { getPriority } from "../utils/priorityHelper";

export function getTopNotifications(
  notifications: Notification[]
): Notification[] {

  return [...notifications]
    .sort((a, b) => {

      const priorityDiff =
        getPriority(b.type) -
        getPriority(a.type);

      if (priorityDiff !== 0)
        return priorityDiff;

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    })
    .slice(0, 10);
}
