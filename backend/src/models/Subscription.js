import mongoose from "mongoose";

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
        values: [
          "Gym",
          "Internet",
          "AI Tools",
          "Entertainment",
          "Education",
          "Mobile",
          "Parking",
          "Family",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
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
      enum: ["NPR", "USD"],
      default: "NPR",
    },
    billingCycle: {
      type: String,
      required: [true, "Billing cycle is required"],
      enum: ["monthly", "weekly", "yearly", "quarterly"],
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
      enum: ["active", "cancelled", "paused"],
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
  },
  { timestamps: true },
);

subscriptionSchema.pre("save", function (next) {
  if (this.isModified("startDate") || this.isModified("billingCycle")) {
    this.nextRenewalDate = computeNextRenewalDate(
      this.startDate,
      this.billingCycle,
    );
  }
  next();
});

subscriptionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.startDate || update.billingCycle) {
    const startDate = update.startDate || this._update.startDate;
    const billingCycle = update.billingCycle || this._update.billingCycle;
    if (startDate && billingCycle) {
      this._update.nextRenewalDate = computeNextRenewalDate(
        new Date(startDate),
        billingCycle,
      );
    }
  }
  next();
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
