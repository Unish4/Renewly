import { daysUntil as computeDaysUntil } from "../utils/formatters.js";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

const getUrgency = (days) => {
  if (days === null || days === undefined) return null;
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 3) return "critical";
  if (days <= 7) return "warning";
  return "ok";
};

const CONFIG = {
  overdue: {
    label: (d) => `${Math.abs(d)}d overdue`,
    className: "bg-red-100 text-red-700",
    Icon: AlertTriangle,
  },
  today: {
    label: () => "Due today",
    className: "bg-red-100 text-red-700",
    Icon: AlertTriangle,
  },
  critical: {
    label: (d) => `${d}d left`,
    className: "bg-orange-100 text-orange-700",
    Icon: Clock,
  },
  warning: {
    label: (d) => `${d}d left`,
    className: "bg-yellow-100 text-yellow-700",
    Icon: Clock,
  },
  ok: {
    label: (d) => `${d}d`,
    className: "bg-gray-100 text-gray-500",
    Icon: CheckCircle,
  },
};

export default function RenewalBadge({
  renewalDate,
  precomputedDays,
  showIfOk = false,
}) {
  const days =
    precomputedDays !== undefined
      ? precomputedDays
      : computeDaysUntil(renewalDate);
  const urgency = getUrgency(days);

  if (!urgency) return null;
  if (urgency === "ok" && !showIfOk) return null;

  const { label, className, Icon } = CONFIG[urgency];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      <Icon size={10} />
      {label(days)}
    </span>
  );
}
