export const formatCurrency = (amount, currency = "NPR") => {
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
// Used in analytics to compare subscriptions with different billing cycles.
export const toMonthlyAmount = (amount, billingCycle) => {
  switch (billingCycle) {
    case "weekly":     return amount * 4.33; // avg weeks per month
    case "monthly":    return amount;
    case "quarterly":  return amount / 3;
    case "yearly":     return amount / 12;
    default:           return amount;
  }
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