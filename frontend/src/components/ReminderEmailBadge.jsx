import { Mail, MailCheck, MailX } from "lucide-react";
import { getNextEmailInfo } from "../stores/reminderStore.js";

export default function ReminderEmailBadge({ daysUntil }) {
  const info = getNextEmailInfo(daysUntil);
  if (!info) return null;

  // Past the overdue window — no more automated emails
  if (!info.firesNow && info.label === "No further emails") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <MailX size={12} className="shrink-0" />
        <span>{info.label}</span>
        <span className="text-gray-300 mx-0.5">·</span>
        <span>{info.sublabel}</span>
      </div>
    );
  }

  // Email fires in today's 8am cron run
  if (info.firesNow) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <MailCheck size={11} />
          {info.label}
        </span>
        <span className="text-xs text-gray-400">{info.sublabel}</span>
      </div>
    );
  }

  // Email fires in a future cron run
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
        <Mail size={11} />
        {info.label}
      </span>
      <span className="text-xs text-gray-400">{info.sublabel}</span>
    </div>
  );
}
