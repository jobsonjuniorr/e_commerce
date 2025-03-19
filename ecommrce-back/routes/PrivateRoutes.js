import express from "express";
import { registerAddress } from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProduct,deleteProduct,criarProduto,getProducts, updateProductAdm } from "../controllers/productController.js";
import { cart,getCart,deleteCartOne,deleteCartAll } from "../controllers/cartController.js";
import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

const protectedRouter = express.Router();

protectedRouter.post("/enderecos", authMiddleware, registerAddress);  

protectedRouter.get("/productAdm",getProducts)
protectedRouter.post("/products", authMiddleware, createProduct)
protectedRouter.put("/updateProduct/:id",upload.single('imagem'),updateProductAdm)
protectedRouter.delete("/deleteProduct/:id",deleteProduct)
protectedRouter.post("/produtctAdm",upload.single('imagem'),criarProduto)


protectedRouter.post("/cart",authMiddleware,cart)
protectedRouter.get("/cart/list",authMiddleware,getCart)
protectedRouter.delete("/cart/deleteItemCart", authMiddleware,deleteCartOne)
protectedRouter.delete("/cart/deleteItemAll",authMiddleware, deleteCartAll)

export default protectedRouter;
