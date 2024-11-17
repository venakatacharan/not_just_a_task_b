import { Router } from "express";
import {
    deleteNotification,
    getAllNotifications
} from "../controllers/notifications.contoller";

const router = Router();

router.get("/", getAllNotifications)

router.delete("/", deleteNotification)

export default router;