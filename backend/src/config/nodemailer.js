import nodemailer from "nodemailer";
import { ENV } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_APP_PASSWORD,
  },
});

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email connection verified successfully.");
  } catch (error) {
    console.error("Error verifying email connection:", error);
  }
};

export default transporter;
