import pool from "../db/db.js";


const itemsOrder = async(pedido_id,produto_id,quantidade,preco) =>{
    const connection  = await pool.getConnection()
    try{
        const [result] = await connection.execute("INSERT INTO itens_pedido (pedido_id,produto_id,quantidade,preco) VALUES (?,?,?,?)",[pedido_id,produto_id,quantidade,preco])
        return result
    }catch(error){
        console.error("Erro ao adicionar produto:", error);
        throw new Error("Erro ao adicionar produto ao banco de dados.");
    }finally{
        connection.release()
    }
}


export default {itemsOrder}