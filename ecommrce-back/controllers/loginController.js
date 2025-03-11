import jwt from "jsonwebtoken";
import User from "../models/loginModel.js";

const ACCESS_SECRET = "919192381"; 
const REFRESH_SECRET = "9193913919"; 

export const loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await User.loginUser(email, senha);

        const accessToken = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email },
            ACCESS_SECRET,
            { expiresIn: "15m" }  // Token de acesso expira rápido
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            REFRESH_SECRET,
            { expiresIn: "7d" }  // Token de atualização dura mais
        );

        // Agora chamamos a função do model para armazenar o refresh token
        await User.storeRefreshToken(user.id, refreshToken);

        res.json({ message: "Login bem-sucedido", accessToken, refreshToken });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
