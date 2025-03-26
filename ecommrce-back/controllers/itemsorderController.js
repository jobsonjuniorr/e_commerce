import ItemsOrder from "../models/itemsorderModel.js"

export const itemsOrder = async(req,res) =>{
   try{
    const {pedido_id,produto_id,quantidade,preco} = req.body

    if(!pedido_id || !produto_id || !quantidade || !preco){
        return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const result =  ItemsOrder.itemsOrder(pedido_id,produto_id,quantidade,preco)
    res.status(201).json({ message: 'Armazenado pedidos'});
   }catch(error){
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar pedido" });
   }
}