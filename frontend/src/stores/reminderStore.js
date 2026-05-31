import { create } from "zustand";
import { reminderService } from "../services/reminder.service.js";
import toast from "react-hot-toast";

export const EMAIL_REMINDER_DAYS = [7, 3, 0, -1];

export const getNextEmailInfo = (daysUntil) => {
  if (daysUntil === null || daysUntil === undefined) return null;

  if (EMAIL_REMINDER_DAYS.includes(daysUntil)) {
    const sublabelMap = {
      7: "7-day warning",
      3: "3-day warning",
      0: "Due today notice",
      [-1]: "Overdue notice",
    };
    return {
      firesNow: true,
      label: "Email sending today",
      sublabel: sublabelMap[daysUntil] || `Due in ${daysUntil} days`,
    };
  }

  if (daysUntil > 7) {
    const wait = daysUntil - 7;
    return {
      firesNow: false,
      label: `Email in ${wait} day${wait !== 1 ? "s" : ""}`,
      sublabel: "7-day warning",
    };
  }

  if (daysUntil > 3) {
    const wait = daysUntil - 3;
    return {
      firesNow: false,
      label: `Email in ${wait} day${wait !== 1 ? "s" : ""}`,
      sublabel: "3-day warning",
    };
  }

  if (daysUntil > 0) {
    return {
      firesNow: false,
      label: `Email in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
      sublabel: "Due today notice",
    };
  }

  if (daysUntil < -1) {
    return {
      firesNow: false,
      label: "No further emails",
      sublabel: "Update the renewal date to resume",
    };
  }

  return null;
};

export const useReminderStore = create((set) => ({
  upcoming: [],
  upcomingSoon: [],
  overdue: [],
  isLoading: false,

  fetchReminders: async () => {
    set({ isLoading: true });
    try {
      const [upcoming, soon, overdue] = await Promise.all([
        reminderService.getUpcoming(30),
        reminderService.getUpcoming(7),
        reminderService.getOverdue(),
      ]);
      set({
        upcoming: upcoming.data,
        upcomingSoon: soon.data,
        overdue: overdue.data,
      });
    } catch (error) {
      toast.error(
        "Failed to fetch reminders: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      set({ isLoading: false });
    }
  },
}));
