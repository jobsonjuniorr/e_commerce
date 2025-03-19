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
    const connection = await pool.getConnection();
    try {
        // Criar um array para armazenar os campos a serem atualizados
        let fields = [];
        let values = [];

        if (nome) {
            fields.push("nome = ?");
            values.push(nome);
        }
        if (descricao) {
            fields.push("descricao = ?");
            values.push(descricao);
        }
        if (preco) {
            fields.push("preco = ?");
            values.push(preco);
        }
        if (estoque) {
            fields.push("estoque = ?");
            values.push(estoque);
        }
        if (categoria) {
            fields.push("categoria = ?");
            values.push(categoria);
        }
        if (imagem) {
            fields.push("imagem = ?");
            values.push(imagem);
        }

        // Se não há nada para atualizar, retorna erro
        if (fields.length === 0) {
            return { affectedRows: 0 };
        }

        // Monta a query dinamicamente
        const query = `UPDATE produtos SET ${fields.join(", ")} WHERE id = ?`;
        values.push(id); // Adiciona o ID no final

        const [result] = await connection.execute(query, values);
        return result;
    } catch (error) {
        console.error("Erro na atualização do produto:", error);
        throw new Error("Erro na atualização do produto");
    } finally {
        connection.release();
    }
};

const getProductById = async (produto_id) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            "SELECT * FROM produtos WHERE id = ?",
            [produto_id]
        );
        return result.length ? result[0] : null;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

export default { addProduct, getProducts,deleteProduct, inserirProduto, updateProduct, getProductById};
