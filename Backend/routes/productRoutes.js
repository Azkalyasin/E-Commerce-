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
import upload from "../middlewares/upload.middlewares.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/search", searchProducts)
router.get("/:id", getProductById);

router.post("/",upload.single("image"),verifyToken, verifyAdmin, createProduct);
router.put("/:id", upload.single("image"), verifyToken, verifyAdmin, updateProduct);
router.delete("/:id",verifyToken, verifyAdmin, deleteProduct);

export default router;
