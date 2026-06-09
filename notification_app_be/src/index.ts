import { fetchNotifications } from "./api/notificationsApi";
import { getTopNotifications } from "./services/priorityInboxService";
import axios from "axios";

// path adjust karna pad sakta hai
import { Log } from "../../logging_middleware/src/logger";

async function main() {
  try {

    await Log(
      "backend",
      "info",
      "service",
      "Fetching notifications from API"
    );

    const notifications =
      await fetchNotifications();

    const topNotifications =
      getTopNotifications(notifications);

    await Log(
      "backend",
      "info",
      "service",
      "Top notifications generated successfully"
    );

    console.log(topNotifications);

  } catch (error) {

    await Log(
      "backend",
      "error",
      "service",
      "Failed to process notifications"
    );

    if (axios.isAxiosError(error)) {
      console.error(
        `API request failed: ${error.response?.status || "unknown"} ${
          error.response?.data?.message || error.message
        }`
      );
      return;
    }

    console.error(error instanceof Error ? error.message : error);
  }
}

main();
