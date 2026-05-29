import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  subscriptionCreateRules,
  subscriptionUpdateRules,
} from "../middleware/subscriptionValidation.js";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getSubscriptionSummary,
} from "../controllers/subscription.controller.js";

const router = Router();

router.get("/", requireAuth, getSubscriptions);
router.get("/summary", requireAuth, getSubscriptionSummary);
router.get("/:id", requireAuth, getSubscriptionById);
router.post(
  "/",
  requireAuth,
  subscriptionCreateRules,
  validate,
  createSubscription,
);
router.put(
  "/:id",
  requireAuth,
  subscriptionUpdateRules,
  validate,
  updateSubscription,
);
router.delete("/:id", requireAuth, deleteSubscription);

export default router;
