import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Bell, ArrowRight, Mail } from "lucide-react";
import { useReminderStore } from "../stores/reminderStore.js";
import { formatCurrency } from "../utils/formatters.js";

export default function UpcomingRenewalsCallout() {
  const {
    upcomingSoon,
    overdue,
    isLoading,
    fetchReminders,
  } = useReminderStore();

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const urgent = [...overdue, ...upcomingSoon];
  const hasUrgent = urgent.length > 0;
  const hasOverdue = overdue.length > 0;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-36 mb-4" />
        <div className="space-y-3">
          <div className="h-14 bg-gray-100 rounded-xl" />
          <div className="h-14 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  // ── All clear
  if (!hasUrgent) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={15} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Upcoming renewals
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-1 font-medium">
          You're all caught up 🎉
        </p>
        <p className="text-xs text-gray-400 mb-4">
          No renewals due in the next 7 days.
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Mail size={11} />
            <span>Email reminders active · 8am NPT</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Has urgent renewals
  const theme = hasOverdue
    ? {
        card: "bg-red-50 border-red-100",
        header: "text-red-700",
        icon: "text-red-600",
        link: "text-red-600 hover:text-red-800",
        divider: "border-red-200/50",
        footer: "text-red-600/70",
        test: "text-red-700 hover:text-red-900",
      }
    : {
        card: "bg-orange-50 border-orange-100",
        header: "text-orange-700",
        icon: "text-orange-600",
        link: "text-orange-600 hover:text-orange-800",
        divider: "border-orange-200/50",
        footer: "text-orange-600/70",
        test: "text-orange-700 hover:text-orange-900",
      };

  return (
    <div className={`border rounded-2xl p-5 ${theme.card}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className={theme.icon} />
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${theme.header}`}
          >
            {hasOverdue ? "Action needed" : "Renewing soon"}
          </span>
        </div>
        <Link
          to="/reminders"
          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${theme.link}`}
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Subscription rows — max 3 */}
      <div className="space-y-2">
        {urgent.slice(0, 3).map((sub) => (
          <div
            key={sub._id}
            className="flex items-center justify-between bg-white/70 rounded-xl px-3.5 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {sub.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {sub.daysUntil < 0
                  ? `${Math.abs(sub.daysUntil)} day${
                      Math.abs(sub.daysUntil) !== 1 ? "s" : ""
                    } overdue`
                  : sub.daysUntil === 0
                  ? "Due today"
                  : `In ${sub.daysUntil} day${
                      sub.daysUntil !== 1 ? "s" : ""
                    }`}
              </p>
            </div>
            <span className="text-sm font-bold text-gray-900 shrink-0 ml-3">
              {formatCurrency(sub.amount, sub.currency)}
            </span>
          </div>
        ))}
      </div>

      {/* Overflow link */}
      {urgent.length > 3 && (
        <Link
          to="/reminders"
          className={`block text-center text-xs mt-3 font-semibold ${theme.link}`}
        >
          + {urgent.length - 3} more
        </Link>
      )}

      {/* Email status footer */}
      <div
        className={`mt-4 pt-3 border-t ${theme.divider} flex items-center justify-between`}
      >
        <div className={`flex items-center gap-1.5 text-xs ${theme.footer}`}>
          <Mail size={11} />
          <span>Email reminders active · 8am NPT</span>
        </div>
      </div>
    </div>
  );
}
