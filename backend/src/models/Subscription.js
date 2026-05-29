import mongoose from "mongoose";
import {
  CATEGORIES,
  BILLING_CYCLES,
  CURRENCIES,
  SUBSCRIPTION_STATUSES,
} from "../config/constants.js";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      maxlength: [100, "Subscription name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: "Category must be one of: " + CATEGORIES.join(", "),
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: CURRENCIES,
      default: "NPR",
    },
    billingCycle: {
      type: String,
      required: [true, "Billing cycle is required"],
      enum: BILLING_CYCLES,
      default: "monthly",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    nextRenewalDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: SUBSCRIPTION_STATUSES,
      default: "active",
    },
    logoUrl: {
      type: String,
      default: null,
    },
    sharedWith: {
      type: Number,
      default: 1,
      min: 1,
    },
    reminderEnabled: {
      type: Boolean,
      default: true,
    },
    website: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

subscriptionSchema.pre("save", async function () {
  if (this.isModified("startDate") || this.isModified("billingCycle")) {
    this.nextRenewalDate = computeNextRenewalDate(
      this.startDate,
      this.billingCycle,
    );
  }
});

subscriptionSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.startDate || update.billingCycle) {
    const existing = await this.model.findOne(this.getQuery());
    if (existing) {
      const startDate = update.startDate || existing.startDate;
      const billingCycle = update.billingCycle || existing.billingCycle;
      if (startDate && billingCycle) {
        this.getUpdate().nextRenewalDate = computeNextRenewalDate(
          new Date(startDate),
          billingCycle,
        );
      }
    }
  }
});

export function computeNextRenewalDate(startDate, billingCycle) {
  const date = new Date(startDate);
  const now = new Date();

  while (date <= now) {
    switch (billingCycle) {
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
  }
  return date;
}

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
