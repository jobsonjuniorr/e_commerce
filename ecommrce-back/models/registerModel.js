import pool from "../db/db.js"
import bcrypt from "bcrypt"

const saltRounds = 10


const postRegisterUser = async (nome, email, senha, telefone) =>{
    const connection = await pool.getConnection()

    try{
        const [existingUser] = await connection.execute("SELECT id FROM usuarios WHERE  email = ?",[email])

        if(existingUser.length > 0){
            return {error: "Esse email já está em uso"}
        }
        const hashedPassword = await bcrypt.hash(senha,saltRounds)

        const [result] = await connection.execute('INSERT INTO usuarios (nome,email,senha,telefone) VALUES (?,?,?,?)',[nome,email,hashedPassword,telefone])
        return result
    }catch(error){
        throw error
    }finally{
        connection.release()
    }
} 
const postRegisterType = async(nome,email,senha,telefone,tipo)=>{
    const connection = await pool.getConnection()
    try{
        const [existingUser] = await connection.execute("SELECT id FROM usuarios WHERE  email = ?",[email])

        if(existingUser.length > 0){
            return {error: "Esse email já está em uso"}
        }
        const hashedPassword = await bcrypt.hash(senha,saltRounds)

        const [result] = await connection.execute('INSERT INTO usuarios (nome,email,senha,telefone, tipo) VALUES (?,?,?,?,?)',[nome,email,hashedPassword,telefone,tipo])
        return result
    }catch(error){
        throw error
    }finally{
        connection.release()
    }
}


export default {postRegisterUser,postRegisterType}