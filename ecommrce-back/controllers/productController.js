import Product from "../models/productModel.js";


export const createProduct = async (req,res) =>{
    try{
        const { nome, descricao, preco, estoque, categoria, imagem } = req.body;

        if(!nome || !descricao || !preco || !estoque || !categoria){
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }
        const validCategori = ["blusa","calca"]

        if(!validCategori.includes(categoria)){
            return res.status(400).json({ error: "Categoria inválida! Escolha entre 'blusa' ou 'calca'." });
        }
        const novoProduto = await Product.addProduct(nome, descricao, preco, estoque, categoria, imagem);
        res.status(201).json({ message: "Produto adicionado com sucesso!", produto: novoProduto });
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
export const getProducts = async (req, res) => {
    try {
        const products = await Product.getProduct();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar os produtos" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getProduct(id);

        if (product.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json(product[0]); 
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o produto" });
    }
};