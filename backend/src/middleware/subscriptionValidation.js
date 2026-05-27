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
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Amount cannot be negative"),

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

  body("sharedWith")
    .optional()
    .isArray()
    .withMessage("Shared with must be an array"),
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
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];
