import express from "express";
import { getAddress, registerAddress } from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProduct,deleteProduct,criarProduto,getProducts, updateProductAdm } from "../controllers/productController.js";
import { cart,getCart,deleteCartOne,deleteCartAll, attCart, getCartOne } from "../controllers/cartController.js";
import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

const protectedRouter = express.Router();

protectedRouter.post("/enderecos", authMiddleware, registerAddress);
protectedRouter.get("/enderecos/visualizacao",authMiddleware, getAddress)  

protectedRouter.get("/productAdm",getProducts)
protectedRouter.post("/products", authMiddleware, createProduct)
protectedRouter.put("/updateProduct/:id",upload.single('imagem'),updateProductAdm)
protectedRouter.delete("/deleteProduct/:id",authMiddleware,deleteProduct)
protectedRouter.post("/produtctAdm",authMiddleware,upload.single('imagem'),criarProduto)


protectedRouter.post("/cart",authMiddleware,cart)
protectedRouter.get("/cart/list",authMiddleware,getCart)
protectedRouter.get("/cart/verificCart",authMiddleware,getCartOne)
protectedRouter.delete("/cart/deleteItemCart", authMiddleware,deleteCartOne)
protectedRouter.delete("/cart/deleteItemAll",authMiddleware, deleteCartAll)
protectedRouter.put("/cart/attItem",authMiddleware,attCart)
export default protectedRouter;
