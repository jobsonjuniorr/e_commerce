import express from "express";
import { registerAddress } from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProduct,getProductById,deleteProduct } from "../controllers/productController.js";
import { cart,getCart,deleteCartOne,deleteCartAll } from "../controllers/cartController.js";

const protectedRouter = express.Router();

protectedRouter.post("/enderecos", authMiddleware, registerAddress);  


protectedRouter.post("/products", authMiddleware, createProduct)
protectedRouter.get("/listIdProduct/:id",authMiddleware, getProductById)
protectedRouter.delete("/deleteProduct",authMiddleware,deleteProduct)

protectedRouter.post("/cart",authMiddleware,cart)
protectedRouter.get("/listCart",authMiddleware,getCart)
protectedRouter.delete("/deleteItemCart", authMiddleware,deleteCartOne)
protectedRouter.delete("/deleteItemAll",authMiddleware, deleteCartAll)

export default protectedRouter;
