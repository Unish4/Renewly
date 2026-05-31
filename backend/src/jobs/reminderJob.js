import cron from "node-cron";
import Subscription from "../models/Subscription.js";
import { sendReminderEmail } from "../utils/sendReminderEmails.js";
import { ENV } from "../config/env.js";

export const REMINDER_WINDOWS_DAYS = [7, 3, 0, -1];

export const runReminderJob = async () => {
  console.log(`\n[Reminders] ── Job started at ${new Date().toISOString()} ──`);

  const results = { sent: 0, failed: 0, skipped: 0, totalSubscriptions: 0 };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateConditions = REMINDER_WINDOWS_DAYS.map((days) => {
      const windowStart = new Date(today);
      windowStart.setDate(windowStart.getDate() + days);
      windowStart.setHours(0, 0, 0, 0);

      const windowEnd = new Date(windowStart);
      windowEnd.setHours(23, 59, 59, 999);

      return { nextRenewalDate: { $gte: windowStart, $lte: windowEnd } };
    });

    const subscriptions = await Subscription.find({
      status: "active",
      reminderEnabled: true,
      $or: dateConditions,
    }).lean();

    results.totalSubscriptions = subscriptions.length;

    if (subscriptions.length === 0) {
      console.log("[Reminders] No subscriptions in reminder windows today");
      return results;
    }

    const byUser = {};
    const msPerDay = 1000 * 60 * 60 * 24;

    subscriptions.forEach((sub) => {
      if (!byUser[sub.userId]) byUser[sub.userId] = [];

      // Attach daysUntil so the email template can render urgency badges.
      sub.daysUntil = Math.round(
        (new Date(sub.nextRenewalDate) - today) / msPerDay,
      );

      byUser[sub.userId].push(sub);
    });

    const userCount = Object.keys(byUser).length;
    console.log(
      `[Reminders] Processing ${userCount} user${userCount !== 1 ? "s" : ""}, ` +
        `${subscriptions.length} subscription${subscriptions.length !== 1 ? "s" : ""}`,
    );

    for (const [userId, userSubs] of Object.entries(byUser)) {
      const result = await sendReminderEmail(userId, userSubs);

      if (result.success) results.sent++;
      else if (result.reason === "no_email") results.skipped++;
      else results.failed++;

      // 200ms pause between sends — polite to Gmail's rate limits
      await new Promise((r) => setTimeout(r, 200));
    }
  } catch (error) {
    console.error("[Reminders] Job crashed:", error.message);
  }

  console.log(
    `[Reminders] ── Job complete: sent=${results.sent} failed=${results.failed} skipped=${results.skipped} ──\n`,
  );
  return results;
};

// Schedule the cron job.
// Only starts in production — in development use the manual trigger endpoint.
export const scheduleReminderJob = () => {
  if (ENV.NODE_ENV !== "production") {
    console.log(
      "[Reminders] Cron not started in development mode.\n" +
        "  → Use POST /api/admin/trigger-reminders to test manually.",
    );
    return;
  }

  cron.schedule("15 2 * * *", async () => {
    console.log("[Reminders] Cron triggered");
    await runReminderJob();
  });

  console.log("[Reminders] Cron scheduled — daily at 8:00 AM NPT (02:15 UTC)");
};
