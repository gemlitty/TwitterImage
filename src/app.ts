import dotenv from "dotenv";
import cron from "node-cron";
import { ScheduleService } from "./Services/ScheduleService";
import { database } from "./Database/Database";

dotenv.config();

const ENV = process.env.APP_ENV || "dev";

const scheduleService = new ScheduleService();

// Based on the limits of the X API. This cronjob can be set!
//@REMOVE
if (ENV === "local") {
  scheduleService.mentionedPostsAndReply();
} else {
  cron.schedule("* * * * *", () => {
    scheduleService.mentionedPostsAndReply();
  });
}

// Enable graceful stop
process.once("SIGINT", () => {
  database.disconnect();
});
process.once("SIGTERM", () => {
  database.disconnect();
});
