import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const cart = async (req, res) => {
    try {
        const usuario_id = req.usuario?.id;
        if (!usuario_id) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        const { produto_id } = req.body; 
        if (!produto_id) {
            return res.status(400).json({ error: "Produto inválido" });
        }

        const produto = await Product.getProductById(produto_id);
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }


        const quantidade = 1; 
        const preco = produto.preco;  

     
        const addCartResult = await Cart.addCart(usuario_id, produto_id, quantidade, preco);

        res.status(201).json({ message: "Produto adicionado ao carrinho", itemCart: addCartResult });

    } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const usuario_id = req.usuario?.id;

        if (!usuario_id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

        const cartItems = await Cart.getCart(usuario_id);
        if(cartItems.length === 0){
           return res.status(200).json({
                message: "Carrinho Vazio",
            });
        }
        res.status(200).json({
            message: "Lista do carrinho do usuário",
            cartItems, 
        });

    } catch (error) {
        console.error("Erro ao listar o carrinho:", error);
        res.status(500).json({ 
            error: "Erro interno do servidor", 
            details: error.message 
        });
    }
};


export const deleteCartOne = async(req,res) =>{
    try{
        const {id} = req.body

        console.log(id)

        if(!id){
          return res.status(401).json({ error: "Item não encontrado" });
        }

        const deleteItem = await Cart.deleteCartOne(id)

        res.status(200).json({
            message: "Item deletado!",
        });

        
    }catch(error){
        console.error("Erro ao deletar o item do carrinho:", error);
        res.status(500).json({ 
            error: "Erro interno do servidor", 
            details: error.message 
        });

    }
}

export const deleteCartAll = async(req,res) =>{
    try{
        const {usuario_id} = req.body

        if(!usuario_id){
            return res.status(401).json({ error: "Nenhum item no carrinho para ser deletado" });
        }

        const deleteAllCart = await Cart.deleteAll(usuario_id)

        res.status(200).json({
            message: "Todos os itens deletados com sucesso!",
        });

    }catch(error){
        console.error("Erro ao deletar o item do carrinho:", error);
        res.status(500).json({ 
            error: "Erro interno do servidor", 
            details: error.message 
        });

    }
}