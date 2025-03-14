import pool from "../db/db.js";
import bcrypt from "bcrypt";

const loginUser = async (email, password) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.execute(
            "SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return {error:"Usuário não encontrado"}
        }

        const user = rows[0];
        const correctPassword = await bcrypt.compare(password, user.senha);

        if (!correctPassword) {
          return{error:"Senha incorreta"}
        }

        return user;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};


export default { loginUser };
