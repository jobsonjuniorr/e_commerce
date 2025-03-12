import express from "express";

import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { getProducts} from "../controllers/productController.js";

const router = express.Router();

router.post("/register", registerUser); 
router.post("/login", loginUser);       
router.get("/listProduct",getProducts)

export default router;
