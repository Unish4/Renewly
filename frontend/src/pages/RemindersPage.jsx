import { useEffect } from "react";
import { useReminderStore } from "../stores/reminderStore.js";
import { Bell, Info, RefreshCw, Mail, BellOff } from "lucide-react";

// Sub-components
import RenewalBadge from "../components/RenewalBadge.jsx";
import CategoryBadge from "../components/CategoryBadge.jsx";
import ReminderEmailBadge from "../components/ReminderEmailBadge.jsx";
import { formatCycleLabel, formatDate } from "../utils/formatters.js";

// ── Skeleton
function ReminderSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2.5">
          <div className="flex gap-2">
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-100 rounded w-16" />
          </div>
          <div className="h-3 bg-gray-100 rounded w-20" />
          <div className="h-5 bg-gray-100 rounded-full w-36" />
        </div>
        <div className="text-right space-y-2 shrink-0">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// ── Section header
function SectionHeader({ icon: Icon, title, count, colorClass, description }) {
  return (
    <div className={`flex items-start gap-3 mb-3 pb-3 border-b ${colorClass}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-sm font-bold">{title}</h2>
          {count > 0 && (
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Single reminder row
function ReminderRow({ subscription }) {
  const isMuted = !(subscription.reminderEnabled ?? true);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-150">
      <div className="flex items-start gap-3">
        {/* ── Left ── */}
        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <p className="text-sm font-bold text-gray-900 truncate max-w-50 sm:max-w-none">
              {subscription.name}
            </p>
            <RenewalBadge
              precomputedDays={subscription.daysUntil}
              renewalDate={subscription.nextRenewalDate}
              showIfOk
            />
            {isMuted && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                <BellOff size={12} className="shrink-0" />
              </span>
            )}
          </div>

          {/* Category */}
          <div className="mb-2.5">
            <CategoryBadge category={subscription.category} />
          </div>

          {/* Email schedule — the unique value this page adds */}
          {isMuted ? (
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Mail size={11} className="shrink-0" />
              Emails muted — toggle from the subscription card to re-enable
            </p>
          ) : (
            <ReminderEmailBadge daysUntil={subscription.daysUntil} />
          )}
        </div>

        {/* ── Right ── */}
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-900">
            {formatCycleLabel(
              subscription.amount,
              subscription.currency,
              subscription.billingCycle,
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(subscription.nextRenewalDate)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page
export default function RemindersPage() {
  const { upcoming, overdue, isLoading, fetchReminders } = useReminderStore();

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Split upcoming into urgency buckets — already sorted by daysUntil ASC from backend
  const dueToday = upcoming.filter((s) => s.daysUntil === 0);
  const thisWeek = upcoming.filter((s) => s.daysUntil > 0 && s.daysUntil <= 7);
  const laterList = upcoming.filter((s) => s.daysUntil > 7);

  const hasContent = overdue.length > 0 || upcoming.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-900 rounded-xl shrink-0">
            <Bell size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Reminders
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Renewals + email schedule
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchReminders}
            disabled={isLoading}
            title="Refresh"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Email system info card ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info size={15} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">
              How email reminders work
            </p>
            <p className="text-sm text-blue-700 leading-relaxed">
              Renewly sends you a digest email automatically at{" "}
              <strong>8:00 AM Nepal time</strong> — 7 days before renewal, again
              at 3 days, and on the due date itself. Mute individual
              subscriptions from the subscription card if needed.
            </p>
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ReminderSkeleton key={i} />
          ))}
        </div>
      ) : !hasContent ? (
        <div className="text-center py-16 sm:py-20">
          <div className="text-5xl sm:text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            All clear — nothing due soon
          </h3>
          <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
            No renewals in the next 30 days. Renewly will email you
            automatically when subscriptions are approaching.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {overdue.length > 0 && (
            <section>
              <SectionHeader
                icon={Bell}
                title="Overdue"
                count={overdue.length}
                colorClass="border-red-200 text-red-700"
                description="Past their renewal date. Edit the subscription's start date to recompute the next renewal."
              />
              <div className="space-y-2.5">
                {overdue.map((s) => (
                  <ReminderRow key={s._id} subscription={s} />
                ))}
              </div>
            </section>
          )}

          {dueToday.length > 0 && (
            <section>
              <SectionHeader
                icon={Bell}
                title="Due today"
                count={dueToday.length}
                colorClass="border-red-200 text-red-700"
                description="Reminder emails are sending today at 8am NPT."
              />
              <div className="space-y-2.5">
                {dueToday.map((s) => (
                  <ReminderRow key={s._id} subscription={s} />
                ))}
              </div>
            </section>
          )}

          {thisWeek.length > 0 && (
            <section>
              <SectionHeader
                icon={Bell}
                title="This week"
                count={thisWeek.length}
                colorClass="border-orange-200 text-orange-700"
                description="Renewals in 1–7 days. Emails fire at the 7-day and 3-day marks."
              />
              <div className="space-y-2.5">
                {thisWeek.map((s) => (
                  <ReminderRow key={s._id} subscription={s} />
                ))}
              </div>
            </section>
          )}

          {laterList.length > 0 && (
            <section>
              <SectionHeader
                icon={Bell}
                title="Later this month"
                count={laterList.length}
                colorClass="border-gray-200 text-gray-600"
                description="Renewals 8–30 days away. First email fires 7 days before each one."
              />
              <div className="space-y-2.5">
                {laterList.map((s) => (
                  <ReminderRow key={s._id} subscription={s} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
