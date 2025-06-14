import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/product.controller.js";
import { verifyAdmin } from "../middlewares/admin.middlewares.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/search", searchProducts)
router.get("/:id", getProductById);

router.post("/",verifyToken, verifyAdmin, createProduct);
router.put("/:id",verifyToken, verifyAdmin, updateProduct);
router.delete("/:id",verifyToken, verifyAdmin, deleteProduct);

export default router;
