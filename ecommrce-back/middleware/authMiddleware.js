import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ error: "Acesso negado! Token não fornecido." });
    }
    const token = authHeader.replace("Bearer ", "").trim();
    try {
        const decoded = jwt.verify(token, "919192381");

        req.usuario = decoded;
        next();
    } catch (error) {
        console.error("Erro ao verificar token:", error); 
        res.status(403).json({ error: "Token inválido ou expirado!" });
    }
};
