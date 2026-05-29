import Subscription from "../models/Subscription.js";
import { getUserId } from "../middleware/auth.middleware.js";

export const createSubscription = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const {
      name,
      category,
      amount,
      currency,
      billingCycle,
      startDate,
      description,
      website,
      sharedWith,
      reminderEnabled,
    } = req.body;

    console.log("Creating subscription with data:", {
      userId,
      name,
      category,
      amount,
      currency,
      billingCycle,
      startDate,
      description,
      website,
      sharedWith,
      reminderEnabled,
    });

    const subscription = new Subscription({
      userId,
      name,
      category,
      amount,
      currency,
      billingCycle,
      startDate,
      description,
      website,
      sharedWith,
      reminderEnabled,
    });

    const saved = await subscription.save();

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    next(error);
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const {
      category,
      status,
      sortBy = "createdAt",
      order = "desc",
      search,
      currency,
    } = req.query;

    const filter = { userId };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (currency) filter.currency = currency;

    if (search) filter.name = { $regex: search, $options: "i" };

    const sort = { [sortBy]: order === "asc" ? 1 : -1 };

    const subscriptions = await Subscription.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const subscription = await Subscription.findOne({ _id: id, userId });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Subscription retrieved successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const allowedUpdates = [
      "name",
      "category",
      "amount",
      "currency",
      "billingCycle",
      "startDate",
      "description",
      "website",
      "status",
      "sharedWith",
      "reminderEnabled",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updated = await Subscription.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const deleted = await Subscription.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionSummary = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const subscriptions = await Subscription.find({
      userId,
      status: "active",
    });

    const toMonthly = {
      weekly: 4.33,
      monthly: 1,
      quarterly: 1 / 3,
      yearly: 1 / 12,
    };

    const summary = {
      NPR: { monthly: 0, yearly: 0, count: 0 },
      USD: { monthly: 0, yearly: 0, count: 0 },
    };

    const byCategory = {};

    subscriptions.forEach((sub) => {
      const multiplier = toMonthly[sub.billingCycle] || 1;
      const monthlyAmount = sub.amount * multiplier;

      if (summary[sub.currency]) {
        summary[sub.currency].monthly += monthlyAmount;
        summary[sub.currency].yearly += monthlyAmount * 12;
        summary[sub.currency].count += 1;
      }

      // Add to category breakdown
      if (!byCategory[sub.category]) {
        byCategory[sub.category] = {
          monthly: 0,
          count: 0,
          currency: sub.currency,
        };
      }
      byCategory[sub.category].monthly += monthlyAmount;
      byCategory[sub.category].count += 1;
    });

    summary.NPR.monthly = Math.round(summary.NPR.monthly * 100) / 100;
    summary.NPR.yearly = Math.round(summary.NPR.yearly * 100) / 100;
    summary.USD.monthly = Math.round(summary.USD.monthly * 100) / 100;
    summary.USD.yearly = Math.round(summary.USD.yearly * 100) / 100;

    res.status(200).json({
      success: true,
      data: {
        summary,
        byCategory,
        totalActiveSubscriptions: subscriptions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
