import Order from "../models/orderModel.js"


export const orderItens = async (req, res) => {
    try {
        const { usuario_id, total, status, endereco_id } = req.body;

        if (!usuario_id || !endereco_id || !total || !status) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        const result = await Order.orderItens(usuario_id, total, status, endereco_id);

        if (!result || !result.insertId) {
            return res.status(500).json({ error: "Erro ao registrar pedido, ID não encontrado" });
        }
      
        res.status(201).json({ 
            message: 'Pedido realizado com sucesso',
            id: result.insertId  
        });

    } catch (error) {
        console.error("Erro no backend:", error);
        res.status(500).json({ error: "Erro ao registrar pedido" });
    }
};

export const getOrderItens = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;

        if (!usuario_id) {
            return res.status(400).json({ error: "Usuário não encontrado." });
        }

        const result = await Order.getOrderItens(usuario_id);

        res.status(200).json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar itens do pedido." });
    }
};
