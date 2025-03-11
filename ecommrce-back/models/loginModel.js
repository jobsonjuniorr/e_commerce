import pool from "../db/db.js";
import bcrypt from "bcrypt";

const loginUser = async (email, senha) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.execute(
            "SELECT id, nome, email, senha FROM usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            throw new Error("Usuário não encontrado");
        }

        const user = rows[0];
        const correctPassword = await bcrypt.compare(senha, user.senha);

        if (!correctPassword) {
            throw new Error("Senha incorreta");
        }

        return user;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

const storeRefreshToken = async (userId, refreshToken) => {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            "UPDATE usuarios SET refresh_token = ? WHERE id = ?",
            [refreshToken, userId]
        );
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

export default { loginUser, storeRefreshToken };
