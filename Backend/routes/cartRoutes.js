import express from "express"
import {
    getUserCart,
    addCartItems,
    updateCartItems,
    deleteCartItems,
} from "../controllers/cart.controller.js"
import {verifyToken} from "../middlewares/auth.middlewares.js"

const router = express.Router();
router.use(verifyToken)
router.get("/",getUserCart)
router.post("/items",addCartItems)
router.put("/items",updateCartItems)
router.delete("/items",deleteCartItems)

export default router