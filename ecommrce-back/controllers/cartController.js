import Cart from "../models/cartModel.js";

export const cart = async (req,res) =>{
    try{
        const {usuario_id,produto_id,quantidade,preco} = req.body
        
        if (!usuario_id || !produto_id || !quantidade || !preco) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }


        const addCartResult = await Cart.addCart(usuario_id,produto_id,quantidade,preco)

        res.status(201).json({messam:"Adicionado ao carrinho",ItemCart: addCartResult})

    }catch(error){
        console.error("Erro ao adicionar ao carrinho:", error);
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
}

export const getCart = async(req,res) =>{
    try{
        const {usuario_id} = req.params

        const getCart = await Cart.getCart(usuario_id)

        if(getCart.length === 0){
            return res.status(404).json({ error: "Nenhum item no carrinho." });
        }
        res.status(201).json({message:"Lista do carrinho do usuário", getCart})
    }catch(error){
        console.error("Erro ao lista o carrinho:", error);
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
}