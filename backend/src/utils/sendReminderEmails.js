import { clerkClient } from "@clerk/express";
import transporter from "../config/nodemailer.js";
import { buildReminderEmail } from "./emailTemplates.js";
import { ENV } from "../config/env.js";

export const sendReminderEmail = async (userId, subscriptions) => {
  try {
    const user = await clerkClient.users.getUser(userId);

    const emailObj = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId,
    );

    if (!emailObj?.emailAddress) {
      console.warn(`[Email] No primary email for user ${userId} — skipping`);
      return { success: false, reason: "no_email" };
    }

    const emailAddress = emailObj.emailAddress;

    // First name for the greeting — fall back to the part before @ in email
    const userName =
      user.firstName ||
      emailAddress.split("@")[0].replace(/[._-]/g, " ").split(" ")[0];

    // Capitalize first letter in case it's lowercase
    const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

    const { subject, html, text } = buildReminderEmail({
      userName: displayName,
      subscriptions,
      appUrl: ENV.CLIENT_URL || "http://localhost:5173",
    });

    const info = await transporter.sendMail({
      from: `"${ENV.EMAIL_FROM_NAME || "Renewly"}" <${ENV.EMAIL_USER}>`,
      to: emailAddress,
      subject,
      html,
      text,
    });

    console.log(
      `[Email] Sent to ${emailAddress} — messageId: ${info.messageId}`,
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Log specifics to help debug — but never crash the cron job
    console.error(`[Email] Failed for user ${userId}:`, error.message);

    // Specific error categories for better debugging
    if (error.code === "EAUTH") {
      console.error(
        "[Email] → Gmail auth failed. Check EMAIL_USER and EMAIL_APP_PASSWORD in .env",
      );
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        "[Email] → Could not connect to Gmail SMTP. Check internet connection.",
      );
    } else if (error.responseCode === 550) {
      console.error(`[Email] → Recipient rejected: ${error.message}`);
    }

    return { success: false, reason: "send_failed", error: error.message };
  }
};
