import pool from "../db/db.js"

const orderItens = async (usuario_id,total,status,endereco_id) =>{
    const connection = await pool.getConnection() 
    try{
        const [result] = await connection.execute("INSERT INTO pedidos (usuario_id,total,status,endereco_id) VALUES (?,?,?,?)",[usuario_id,total,status,endereco_id])
        return result
    }catch(error){
        console.error("Erro ao adicionar produto:", error);
        throw new Error("Erro na criação do pedido");
    }finally{
         connection.release()
    }
}

const getOrderItens = async(usuario_id)=>{
    const connection = await pool.getConnection()
    try{
        const [result] = await connection.execute("SELECT * FROM pedidos WHERE usuario_id = ?",[usuario_id])
        return result
    }catch(error){
        console.error("Erro ao adicionar produto:", error);
        throw new Error("Erro na criação do pedido");
    }finally{
         connection.release()
    }
}

export default {orderItens,getOrderItens}