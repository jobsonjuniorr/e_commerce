import pool from "../db/db.js";

const addCart = async (usuario_id, produto_id, quantidade, preco) => {
    const connection = await pool.getConnection()

    try {
        const precoNumerico = parseFloat(preco)

        const [result] = await connection.execute("INSERT INTO carrinho (usuario_id,produto_id,quantidade,preco) VALUES (?,?,?,?)", [usuario_id, produto_id, quantidade, precoNumerico])
       
        return {
            id: result.insertId,
            usuario_id,
            produto_id,
            quantidade,
            preco: precoNumerico,
        };
    } catch (error) {
        throw error
    } finally {
        connection.release()
    }
}

const getCart = async (usuario_id) => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT c.id, c.produto_id, p.nome, p.descricao, p.preco, c.quantidade, p.imagem 
         FROM carrinho c
         JOIN produtos p ON c.produto_id = p.id
         WHERE c.usuario_id = ?`,
        [usuario_id]
      );
      const produtos = rows.map(produto => ({
        ...produto,
        imagem: produto.imagem ? `data:image/jpeg;base64,${produto.imagem.toString("base64")}` : null,
    }));

      return produtos;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  };

const deleteCartOne = async (id) => {
    const connection = await pool.getConnection()
    try {
        const [result] = await connection.execute("DELETE FROM carrinho WHERE id = ? ", [id])
        return result
    } catch (error) {
        throw error
    } finally {
        connection.release()
    }
}


const deleteAll = async (usuario_id) =>{
    const connection = await pool.getConnection()
    try{
        const [result] = await connection.execute("DELETE FROM carrinho WHERE usuario_id = ? ",[usuario_id])
        return result
    }catch(error){
        throw error
    }finally{
        connection.release()
    }
}
const attCart = async(id,quantidade,preco) =>{
    const connection = await pool.getConnection()
    try{
        const [result] = await connection.execute("UPDATE carrinho SET quantidade = ?, preco = ? WHERE id = ?", [quantidade,preco, id])
        return result

    }catch(error){
        throw error
    }finally{
        connection.release()
    }
}

export default { addCart, getCart,deleteCartOne,deleteAll,attCart }