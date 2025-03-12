import express from "express";
import { registerAddress } from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProduct,getProductById } from "../controllers/productController.js";

const protectedRouter = express.Router();

protectedRouter.post("/enderecos", authMiddleware, registerAddress);  
protectedRouter.post("/products", authMiddleware, createProduct)
protectedRouter.get("/listIdProduct/:id",authMiddleware, getProductById)

export default protectedRouter;
