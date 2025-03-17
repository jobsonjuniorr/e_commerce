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

        const produtos = result.map(produto => ({
            ...produto,
            imagem: produto.imagem ? `data:image/jpeg;base64,${produto.imagem.toString("base64")}` : null,
        }));

        return produtos;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw new Error("Erro ao buscar produtos.");
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
const inserirProduto = async(nome, descricao, preco, estoque, categoria, imagem) =>{
    const connection = await pool.getConnection()
    try{
        const [result] = await connection.execute("INSERT INTO produtos (nome, descricao, preco, estoque, categoria, imagem) VALUES (?, ?, ?, ?, ?, ?)",[nome, descricao, preco, estoque, categoria, imagem])
    }catch(error){
        console.error("Erro na inserção da imagem:", error);
        throw new Error("Erro na iamgem");
    }finally{
        connection.release()
    }
}

const updateProduct = async (id, nome, descricao, preco, estoque, categoria, imagem) => {
    const connection = await pool.getConnection()
    try {
      const query = `
        UPDATE produtos
        SET nome = ?, descricao = ?, preco = ?, estoque = ?, categoria = ?, imagem = ?
        WHERE id = ?
      `;
      
      const result = await connection.execute(query, [nome, descricao, preco, estoque, categoria, imagem, id]);
      
      return result;
    } catch (error) {
      console.error("Erro na atualização do produto:", error);
      throw new Error("Erro na atualização do produto");
    }
  };
export default { addProduct, getProducts,deleteProduct, inserirProduto, updateProduct};
