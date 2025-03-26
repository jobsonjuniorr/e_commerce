import pool from "../db/db.js";


const requestingPayment = async(pedido_id,metodo_pagamento,status)=>{
    const connection = await pool.getConnection()
    try{
        const [result] = await connection.execute("INSERT INTO pagamentos (pedido_id,metodo_pagamento,status) VALUES (?,?,?)",[pedido_id,metodo_pagamento,status])
        return result
    }catch(error){
        console.error("Erro ao adicionar pagamento", error);
        throw new Error("Erro no armazenamento do pagamento");
    }finally{
        connection.release()
    }
}


export default {requestingPayment}