import express from "express";
import { getAllOrders, getOrderById, updateOrderStatus, deleteOrder, createOrder } from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = express.Router()
router.use(verifyToken)

router.post("/", createOrder);

router.get("/", getAllOrders);

router.get("/:id", getOrderById);

router.patch("/:id/status", updateOrderStatus);

router.delete("/:id", deleteOrder);

export default router;