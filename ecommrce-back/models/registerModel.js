import pool from "../db/db.js"
import bcrypt from "bcrypt"

const saltRounds = 10


const postRegisterUser = async (nome, email, senha, telefone) =>{
    const connection = await pool.getConnection()

    try{
        const hashedPassword = await bcrypt.hash(senha,saltRounds)

        const [result] = await connection.execute('INSERT INTO usuarios (nome,email,senha,telefone) VALUES (?,?,?,?)',[nome,email,hashedPassword,telefone])
        return result
    }catch(error){
        throw error
    }finally{
        connection.release()
    }
} 


export default {postRegisterUser}