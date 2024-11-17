import { Router } from "express";

import authRotes from "./auth.routes";
import customersRoutes from "./customers.routes";
import notificationsRoutes from "./notifications.routes";
import ordersRoutes from "./orders.routes";
import audienceRoutes from "./audience.routes";
import campaignRoutes from "./campaign.routes";

import { isAuthenticated } from "../utils/isAuthenticated";

const router = Router();

router.use("/auth", authRotes);
router.use("/customers", isAuthenticated, customersRoutes);
router.use("/notifications", isAuthenticated,  notificationsRoutes);
router.use("/orders",isAuthenticated, ordersRoutes)
router.use("/audience",isAuthenticated, audienceRoutes)
router.use("/campaigns",isAuthenticated, campaignRoutes)

export default router;
