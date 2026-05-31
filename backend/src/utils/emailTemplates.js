const formatAmount = (amount, currency) => {
  if (currency === "NPR") {
    return `Rs. ${new Intl.NumberFormat("en-NP").format(Math.round(amount))}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const cycleLabel = (cycle) => {
  const map = {
    monthly: "/mo",
    yearly: "/yr",
    quarterly: "/qtr",
    weekly: "/wk",
  };
  return map[cycle] || "";
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

// Returns color theme based on urgency — used for badges and section headers
const getUrgencyTheme = (daysUntil) => {
  if (daysUntil < 0)
    return {
      bg: "#fef2f2",
      border: "#fecaca",
      badge: "#dc2626",
      text: "#991b1b",
      label: `${Math.abs(daysUntil)}d overdue`,
    };
  if (daysUntil === 0)
    return {
      bg: "#fef2f2",
      border: "#fecaca",
      badge: "#dc2626",
      text: "#991b1b",
      label: "Due today",
    };
  if (daysUntil <= 3)
    return {
      bg: "#fff7ed",
      border: "#fed7aa",
      badge: "#ea580c",
      text: "#9a3412",
      label: `${daysUntil} days left`,
    };
  if (daysUntil <= 7)
    return {
      bg: "#fefce8",
      border: "#fde68a",
      badge: "#ca8a04",
      text: "#854d0e",
      label: `${daysUntil} days left`,
    };
  return {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    badge: "#16a34a",
    text: "#14532d",
    label: `${daysUntil} days`,
  };
};

// ── Subscription card row
const subscriptionCard = (sub) => {
  const theme = getUrgencyTheme(sub.daysUntil);

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
      <tr>
        <td style="
          background: ${theme.bg};
          border: 1px solid ${theme.border};
          border-radius: 12px;
          padding: 14px 16px;
        ">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <!-- Left: name + category + date -->
              <td style="vertical-align: top; padding-right: 12px;">
                <p style="margin: 0 0 3px; font-size: 15px; font-weight: 600; color: #111827; line-height: 1.3;">
                  ${sub.name}
                </p>
                <p style="margin: 0 0 6px; font-size: 12px; color: #6b7280;">
                  ${sub.category}
                </p>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                  Renews ${formatDate(sub.nextRenewalDate)}
                </p>
              </td>

              <!-- Right: urgency badge + amount -->
              <td style="vertical-align: top; text-align: right; white-space: nowrap;">
                <span style="
                  display: inline-block;
                  background: ${theme.badge};
                  color: #ffffff;
                  font-size: 11px;
                  font-weight: 600;
                  padding: 4px 10px;
                  border-radius: 99px;
                  margin-bottom: 6px;
                ">
                  ${theme.label}
                </span>
                <p style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">
                  ${formatAmount(sub.amount, sub.currency)}
                  <span style="font-size: 12px; font-weight: 400; color: #9ca3af;">
                    ${cycleLabel(sub.billingCycle)}
                  </span>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

// ── Main reminder email builder

export const buildReminderEmail = ({ userName, subscriptions, appUrl }) => {
  // Sort by urgency — overdue first, then soonest
  const sorted = [...subscriptions].sort((a, b) => a.daysUntil - b.daysUntil);

  const overdueList = sorted.filter((s) => s.daysUntil < 0);
  const todayList = sorted.filter((s) => s.daysUntil === 0);
  const upcomingList = sorted.filter((s) => s.daysUntil > 0);

  // Subject line — most urgent situation takes priority
  let subject;
  if (overdueList.length > 0) {
    subject = `⚠️ ${overdueList.length} subscription${overdueList.length > 1 ? "s" : ""} overdue — Renewly`;
  } else if (todayList.length > 0) {
    subject = `🔔 ${todayList.length} subscription${todayList.length > 1 ? "s" : ""} renewing today — Renewly`;
  } else {
    subject = `📅 ${subscriptions.length} upcoming renewal${subscriptions.length > 1 ? "s" : ""} — Renewly`;
  }

  // Intro paragraph — contextual based on what's in the email
  let introParagraph;
  if (overdueList.length > 0 && upcomingList.length > 0) {
    introParagraph = `You have <strong style="color: #dc2626;">${overdueList.length} overdue</strong> and <strong>${upcomingList.length} upcoming</strong> subscription renewal${upcomingList.length > 1 ? "s" : ""} to review.`;
  } else if (overdueList.length > 0) {
    introParagraph = `You have <strong style="color: #dc2626;">${overdueList.length} overdue</strong> subscription renewal${overdueList.length > 1 ? "s" : ""}. Please update the renewal dates.`;
  } else if (todayList.length > 0) {
    introParagraph = `${todayList.length > 1 ? `${todayList.length} of your subscriptions renew` : "One of your subscriptions renews"} <strong>today</strong>. Make sure your payment methods are ready.`;
  } else {
    introParagraph = `You have <strong>${subscriptions.length}</strong> subscription renewal${subscriptions.length > 1 ? "s" : ""} coming up in the next few days.`;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">

        <!-- Content column — max 560px -->
        <table width="100%" style="max-width: 560px;" cellpadding="0" cellspacing="0">

          <!-- ── Brand header ── -->
          <tr>
            <td style="padding-bottom: 20px; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="display: inline-table;">
                <tr>
                  <td style="
                    background: #111827;
                    border-radius: 10px;
                    padding: 8px 18px;
                  ">
                    <span style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                      Renewly
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Main card ── -->
          <tr>
            <td style="
              background: #ffffff;
              border-radius: 16px;
              border: 1px solid #e5e7eb;
              overflow: hidden;
            ">

              <!-- Card top padding -->
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Greeting -->
                <tr>
                  <td style="padding: 28px 28px 20px;">
                    <p style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #111827; line-height: 1.2;">
                      Hi ${userName} 👋
                    </p>
                    <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                      ${introParagraph}
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 28px;">
                    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 0;" />
                  </td>
                </tr>

                <!-- Subscription cards -->
                <tr>
                  <td style="padding: 20px 28px 8px;">
                    ${sorted.map(subscriptionCard).join("")}
                  </td>
                </tr>

                <!-- Total summary -->
                <tr>
                  <td style="padding: 0 28px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="
                      background: #f9fafb;
                      border-radius: 10px;
                      padding: 12px 16px;
                    ">
                      <tr>
                        <td style="font-size: 13px; color: #6b7280;">
                          Total across ${subscriptions.length} subscription${subscriptions.length > 1 ? "s" : ""}
                        </td>
                        <td style="text-align: right;">
                          ${(() => {
                            // Group totals by currency
                            const totals = {};
                            subscriptions.forEach((s) => {
                              if (!totals[s.currency]) totals[s.currency] = 0;
                              totals[s.currency] += s.amount;
                            });
                            return Object.entries(totals)
                              .map(
                                ([currency, amount]) =>
                                  `<span style="font-size: 14px; font-weight: 700; color: #111827;">${formatAmount(amount, currency)}</span>`,
                              )
                              .join(
                                '<span style="color: #d1d5db; margin: 0 6px;">·</span>',
                              );
                          })()}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA button -->
                <tr>
                  <td style="padding: 8px 28px 28px; text-align: center;">
                    <a
                      href="${appUrl}/reminders"
                      style="
                        display: inline-block;
                        background: #111827;
                        color: #ffffff;
                        font-size: 14px;
                        font-weight: 600;
                        padding: 14px 32px;
                        border-radius: 10px;
                        text-decoration: none;
                        letter-spacing: 0.1px;
                      "
                    >
                      View reminders in Renewly →
                    </a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="padding: 24px 0 8px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; line-height: 1.7;">
                You're receiving this because you have an active Renewly account.<br />
                Emails are sent at <strong>8:00 AM Nepal Standard Time</strong> daily.<br />
                To mute a specific subscription, open it in Renewly and toggle reminders off.
              </p>
              <a
                href="${appUrl}"
                style="font-size: 12px; color: #6b7280; text-decoration: underline;"
              >
                Open Renewly
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;

  // Plain text version — shown in clients that prefer text,
  // and improves spam score by showing the email isn't HTML-only
  const text = `
Hi ${userName},

${overdueList.length > 0 ? `OVERDUE (${overdueList.length}):` : ""}
${overdueList.map((s) => `  • ${s.name} — ${formatAmount(s.amount, s.currency)}${cycleLabel(s.billingCycle)} — ${Math.abs(s.daysUntil)} day(s) overdue`).join("\n")}

${todayList.length > 0 ? `DUE TODAY (${todayList.length}):` : ""}
${todayList.map((s) => `  • ${s.name} — ${formatAmount(s.amount, s.currency)}${cycleLabel(s.billingCycle)}`).join("\n")}

${upcomingList.length > 0 ? `UPCOMING (${upcomingList.length}):` : ""}
${upcomingList.map((s) => `  • ${s.name} — ${formatAmount(s.amount, s.currency)}${cycleLabel(s.billingCycle)} — in ${s.daysUntil} day(s)`).join("\n")}

View all reminders: ${appUrl}/reminders

---
Renewly — Subscription tracker
Emails sent daily at 8:00 AM Nepal Standard Time.
To mute a subscription, open it in Renewly and toggle reminders off.
  `.trim();

  return { subject, html, text };
};
