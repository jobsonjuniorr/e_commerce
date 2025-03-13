import pool from "../db/db.js";

const addProduct = async (nome, descricao, preco, estoque, categoria, imagem) => {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute(
            "INSERT INTO produtos (nome, descricao, preco, estoque, categoria, imagem) VALUES (?, ?, ?, ?, ?, ?)",
            [nome, descricao, preco, estoque, categoria, imagem]
        );

        return { id: result.insertId, nome, descricao, preco, estoque, categoria, imagem };
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        throw new Error("Erro ao adicionar produto ao banco de dados.");
    } finally {
        connection.release();
    }
};

const getProducts = async () => {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute("SELECT * FROM produtos");
        return result;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw new Error("Erro ao buscar produtos.");
    } finally {
        connection.release();
    }
};

const getProductById = async (id) => {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute("SELECT * FROM produtos WHERE id = ?", [id]);

        if (result.length === 0) {
            return null; 
        }

        return result[0];
    } catch (error) {
        console.error("Erro ao buscar produto por ID:", error);
        throw new Error("Erro ao buscar produto no banco de dados.");
    } finally {
        connection.release();
    }
};

const deleteProduct =  async (id) =>{
    const connection = await pool.getConnection()

    try{
        const [result] = await connection.execute("DELETE FROM produtos WHERE id = ?",[id])
        return result
    }catch(error){
        console.error("Erro ao buscar produto por ID:", error);
        throw new Error("Erro ao buscar produto no banco de dados.");
    }finally{
        connection.release()
    }
}

export default { addProduct, getProducts, getProductById,deleteProduct };
