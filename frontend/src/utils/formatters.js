export const formatCurrency = (amount, currency = "NPR") => {
  if (typeof amount !== "number" || isNaN(amount)) return "—";

  if (currency === "NPR") {
    const formatted = new Intl.NumberFormat("ne-NP", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
    return `Rs. ${formatted}`;
  }

  // USD uses standard US formatting: $1,200.00
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Converts any subscription amount to a monthly equivalent.
export const toMonthlyAmount = (amount, billingCycle) => {
  const multipliers = {
    weekly: 4.33, // 365 / 12 / 7 — average weeks per month
    monthly: 1,
    quarterly: 1 / 3,
    yearly: 1 / 12,
  };
  return amount * (multipliers[billingCycle] || 1);
};

// Formats a date for display. Returns "Jun 15, 2025" style.
export const formatDate = (date) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

// Returns how many days until a date. Negative = overdue.
export const daysUntil = (date) => {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffMs = target - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const formatCycleLabel = (amount, currency, billingCycle) => {
  const labels = {
    weekly: "/ wk",
    monthly: "/ mo",
    quarterly: "/ qtr",
    yearly: "/ yr",
  };
  return `${formatCurrency(amount, currency)} ${labels[billingCycle] || ""}`;
};
