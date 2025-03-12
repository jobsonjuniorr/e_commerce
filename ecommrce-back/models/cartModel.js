import pool from "../db/db.js";

const addCart = async (usuario_id,produto_id,quantidade,preco)=>{
    const connection = await pool.getConnection()

    try{
        const precoNumerico = parseFloat(preco)
        
        const [result] = await connection.execute("INSERT INTO carrinho (usuario_id,produto_id,quantidade,preco) VALUES (?,?,?,?)", [usuario_id,produto_id,quantidade,precoNumerico])
        console.log("Item adicionado ao carrinho com ID:", result.insertId);
        return {
            id: result.insertId,
            usuario_id,
            produto_id,
            quantidade,
            preco: precoNumerico,
        };
    }catch(error){
        throw error
    }finally{
       connection.release()
    }
}

const getCart = async (usuario_id) =>{
    const connection = await pool.getConnection()
    try{
        const [result] = await connection.execute("SELECT * FROM carrinho WHERE usuario_id = ?",[usuario_id])
        return result
    }catch(error){
        throw error
    }finally{
        connection.release()
    }
}
 

export default  {addCart,getCart}