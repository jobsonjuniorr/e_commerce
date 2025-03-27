import express from "express";
import { getAddress, getIdAddres, registerAddress } from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProduct,deleteProduct,criarProduto,getProducts, updateProductAdm } from "../controllers/productController.js";
import { cart,getCart,deleteCartOne,deleteCartAll, attCart, getCartOne } from "../controllers/cartController.js";
import multer from "multer";
import { getOrderItens, orderItens } from "../controllers/orderController.js";
import { itemsOrder } from "../controllers/itemsorderController.js";
import { paymetRegister } from "../controllers/paymet.js";

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

const protectedRouter = express.Router();

protectedRouter.post("/enderecos", authMiddleware, registerAddress);
protectedRouter.get("/enderecos/visualizacao",authMiddleware, getAddress)  
protectedRouter.post("/enderecos/paymet",authMiddleware,getIdAddres)

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

protectedRouter.post("/order",authMiddleware,orderItens)
protectedRouter.post("/itemsOrder",authMiddleware,itemsOrder)
protectedRouter.get("/order/getItem",authMiddleware,getOrderItens)

protectedRouter.post("/paymet/register",authMiddleware,paymetRegister)

export default protectedRouter;
