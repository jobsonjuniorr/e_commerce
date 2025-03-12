import pool from "../db/db.js"


const addProduct = async (nome, descricao, preco, estoque, categoria, imagem) => {
    const connection = await pool.getConnection()

    try {
        const [result] = await connection.execute("INSERT INTO produtos (nome, descricao, preco, estoque, categoria, imagem) VALUES (?, ?, ?, ?, ?, ?)",
            [nome, descricao, preco, estoque, categoria, imagem])
        return { id: result.insertId, nome, descricao, preco, estoque, categoria, imagem };
    } catch (error) {
        throw error
    }finally{
        connection.release()
    }
}

const getProduct = async(id = null) =>{
    const connection = await pool.getConnection()

    try{
        let query = "SELECT * FROM produtos";
        const params = [];

        if (id) {
            query += " WHERE id = ?";
            params.push(id);
        }

        const [result] = await connection.execute(query, params);
        return result;
    }catch(error){
        throw error
    }finally{
        connection.release()
    }
}
export default {addProduct, getProduct}