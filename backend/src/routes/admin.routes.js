import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { triggerReminders } from "../controllers/admin.controller.js";

const router = Router();

router.post("/trigger-reminders", requireAuth, triggerReminders);

export default router;
