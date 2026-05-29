import { body } from "express-validator";

const VALID_CATEGORIES = [
  "Gym",
  "Internet",
  "AI Tools",
  "Entertainment",
  "Education",
  "Mobile",
  "Parking",
  "Family",
  "Other",
];

const VALID_BILLING_CYCLES = ["monthly", "yearly", "weekly", "quarterly"];
const VALID_CURRENCIES = ["NPR", "USD"];
const VALID_STATUSES = ["active", "paused", "cancelled"];

export const subscriptionCreateRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subscription name is required")
    .isLength({ max: 100 })
    .withMessage("Subscription name cannot exceed 100 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(VALID_CATEGORIES)
    .withMessage("Invalid category"),

  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  body("currency")
    .isIn(VALID_CURRENCIES)
    .withMessage("Currency must be either 'NPR' or 'USD'"),

  body("billingCycle")
    .notEmpty()
    .withMessage("Billing cycle is required")
    .isIn(VALID_BILLING_CYCLES)
    .withMessage("Invalid billing cycle"),

  body("startDate").notEmpty().isISO8601().withMessage("Invalid start date"),

  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),

  body("website")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Website cannot exceed 500 characters"),

  body("sharedWith")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Shared with must be at least 1"),

  body("reminderEnabled")
    .optional()
    .isBoolean()
    .withMessage("Reminder enabled must be a boolean"),
];

export const subscriptionUpdateRules = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("category")
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage("Invalid category"),

  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  body("currency")
    .optional()
    .isIn(VALID_CURRENCIES)
    .withMessage("Currency must be NPR or USD"),

  body("billingCycle")
    .optional()
    .isIn(VALID_BILLING_CYCLES)
    .withMessage("Invalid billing cycle"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("status").optional().isIn(VALID_STATUSES).withMessage("Invalid status"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),

  body("website")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Website cannot exceed 500 characters"),

  body("reminderEnabled")
    .optional()
    .isBoolean()
    .withMessage("Reminder enabled must be a boolean"),
];
