import express from "express";
import { registerAddress } from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const protectedRouter = express.Router();

protectedRouter.post("/enderecos", authMiddleware, registerAddress);  

export default protectedRouter;
