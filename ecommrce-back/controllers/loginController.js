import loginModel from "../models/loginModel.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Campos não preenchidos" });
        }

        const user = await loginModel.loginUser(email, password);

        if (user.error) {
            return res.status(401).json({ message: user.error });
        }

        const accessToken = jwt.sign(
            { id: user.id, nome: user.nome },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        
        const {id,senha, email:_, ...userWithoutPassword} = user
        res.status(200).json({ message: "Login bem-sucedido", user:userWithoutPassword,accessToken });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
};
