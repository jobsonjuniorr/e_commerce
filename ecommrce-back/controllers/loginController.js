import jwt from "jsonwebtoken";
import User from "../models/loginModel.js";
import dotenv from "dotenv";

dotenv.config();


export const loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await User.loginUser(email, senha);

        const accessToken = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }  
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }  
        );

        await User.storeRefreshToken(user.id, refreshToken);

        res.json({ message: "Login bem-sucedido", accessToken, refreshToken, tipo: user.tipo });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
