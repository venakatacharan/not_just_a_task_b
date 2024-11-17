import { Router } from "express";
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder, getOrdersCount,
} from "../controllers/orders.controller";


import {
    createOrderValidation,
    updateOrderValidation,
} from "../validators/orders.validators";

const router = Router();

router.get("/count", getOrdersCount);

router.get("/", getOrders);

router.post("/", createOrderValidation, createOrder);

router.get("/:id", getOrder);

router.put("/:id", updateOrderValidation, updateOrder);

router.delete("/", deleteOrder);

export default router;
