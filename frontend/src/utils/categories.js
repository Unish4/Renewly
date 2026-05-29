export const CATEGORIES = [
  {
    value: "Gym",
    label: "Gym",
    icon: "Dumbbell",
    color: "bg-orange-100 text-orange-700",
    chartColor: "#f97316",
  },
  {
    value: "Internet",
    label: "Internet",
    icon: "Wifi",
    color: "bg-blue-100 text-blue-700",
    chartColor: "#3b82f6",
  },
  {
    value: "AI Tools",
    label: "AI Tools",
    icon: "Bot",
    color: "bg-purple-100 text-purple-700",
    chartColor: "#a855f7",
  },
  {
    value: "Entertainment",
    label: "Entertainment",
    icon: "Tv",
    color: "bg-pink-100 text-pink-700",
    chartColor: "#ec4899",
  },
  {
    value: "Education",
    label: "Education",
    icon: "BookOpen",
    color: "bg-green-100 text-green-700",
    chartColor: "#22c55e",
  },
  {
    value: "Mobile",
    label: "Mobile",
    icon: "Smartphone",
    color: "bg-cyan-100 text-cyan-700",
    chartColor: "#06b6d4",
  },
  {
    value: "Parking",
    label: "Parking",
    icon: "Car",
    color: "bg-gray-100 text-gray-600",
    chartColor: "#6b7280",
  },
  {
    value: "Family",
    label: "Family",
    icon: "Users",
    color: "bg-rose-100 text-rose-700",
    chartColor: "#f43f5e",
  },
  {
    value: "Other",
    label: "Other",
    icon: "MoreHorizontal",
    color: "bg-slate-100 text-slate-600",
    chartColor: "#94a3b8",
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c]),
);

export const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly", shortLabel: "mo" },
  { value: "yearly", label: "Yearly", shortLabel: "yr" },
  { value: "quarterly", label: "Quarterly", shortLabel: "qtr" },
  { value: "weekly", label: "Weekly", shortLabel: "wk" },
];

export const CURRENCIES = [
  { value: "NPR", label: "NPR — Nepali Rupee", symbol: "Rs." },
  { value: "USD", label: "USD — US Dollar", symbol: "$" },
];

// Currency symbol lookup — used in cards and form placeholders
export const CURRENCY_SYMBOL = { NPR: "Rs.", USD: "$" };
