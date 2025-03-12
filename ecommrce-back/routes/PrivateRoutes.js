import express from "express";
import { registerAddress } from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProduct,getProductById } from "../controllers/productController.js";
import { cart,getCart } from "../controllers/cartController.js";

const protectedRouter = express.Router();

protectedRouter.post("/enderecos", authMiddleware, registerAddress);  
protectedRouter.post("/products", authMiddleware, createProduct)
protectedRouter.get("/listIdProduct/:id",authMiddleware, getProductById)
protectedRouter.post("/cart",authMiddleware,cart)
protectedRouter.get("/listCart/:usuario_id",authMiddleware,getCart)

export default protectedRouter;
