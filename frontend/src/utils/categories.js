export const CATEGORIES = [
  {
    value: "Gym",
    label: "Gym",
    icon: "Dumbbell",
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "Internet",
    label: "Internet",
    icon: "Wifi",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "AI Tools",
    label: "AI Tools",
    icon: "Bot",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "Entertainment",
    label: "Entertainment",
    icon: "Tv",
    color: "bg-pink-100 text-pink-700",
  },
  {
    value: "Education",
    label: "Education",
    icon: "BookOpen",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "Mobile",
    label: "Mobile",
    icon: "Smartphone",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    value: "Parking",
    label: "Parking",
    icon: "Car",
    color: "bg-gray-100 text-gray-700",
  },
  {
    value: "Family",
    label: "Family",
    icon: "Users",
    color: "bg-rose-100 text-rose-700",
  },
  {
    value: "Other",
    label: "Other",
    icon: "MoreHorizontal",
    color: "bg-slate-100 text-slate-600",
  },
];

// Quick lookup by value — O(1) instead of .find() every time.
export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c]),
);

export const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "weekly", label: "Weekly" },
];

export const CURRENCIES = [
  { value: "NPR", label: "NPR (Rs.)" },
  { value: "USD", label: "USD ($)" },
];
