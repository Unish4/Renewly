import { runReminderJob } from "../jobs/reminderJob.js";

export const triggerReminders = async (req, res, next) => {
  try {
    console.log("[Admin] Manual reminder trigger initiated");
    const results = await runReminderJob();

    res.status(200).json({
      success: true,
      message: "Reminder job completed",
      results,
    });
  } catch (error) {
    next(error);
  }
};
