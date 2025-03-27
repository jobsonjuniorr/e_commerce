import pool from "../db/db.js"

const postAddress = async (usuario_id, rua, numero, complemento, bairro, cidade, estado, cep, padrao = false) => {
    const connection = await pool.getConnection();

    try {
        const sql = `INSERT INTO enderecos (usuario_id, rua, numero, complemento, bairro, cidade, estado, cep, padrao) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [usuario_id, rua, numero, complemento, bairro, cidade, estado, cep, padrao];

        const [result] = await connection.execute(sql, values);
        return result;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}
const getAddress = async(usuario_id) =>{
    const connection = await pool.getConnection()
    try{
        const [result] = await connection.execute("SELECT * FROM enderecos WHERE usuario_id = ?", [usuario_id])
        return result
    }catch(error){
        throw error
    }finally{
        connection.release()
    }
}


const getIdAddres = async(id) =>{
    const connection = await pool.getConnection()
    try{
        const [result] = await connection.execute("SELECT * FROM enderecos WHERE id = ?",[id])
        return result
    }catch(error){
        throw error
    }finally{
        connection.release()
    }
}

export default { postAddress,getAddress,getIdAddres };