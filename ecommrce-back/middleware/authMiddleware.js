import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acesso negado! Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.usuario = decoded;
        next();
    } catch (error) {
        console.error("Erro ao verificar token:", error.message);
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Sessão expirada, faça login novamente." });
        }
        
        return res.status(403).json({ error: "Token inválido!" });
    }
};
