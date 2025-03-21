import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization")?.trim();
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Acesso negado! Token não fornecido." });
        }

        const token = authHeader.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ error: "Token não encontrado." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: "Token inválido!" });
        }

        req.usuario = decoded;
        next();

    } catch (error) {
      
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Sessão expirada, faça login novamente." });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Token inválido!" });
        }

        return res.status(500).json({ error: "Erro interno na autenticação." });
    }
};
