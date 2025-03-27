import Paymet from "../models/paymet.js";
import Order from "../models/orderModel.js"
export const paymetRegister = async (req, res) => {
    try {
        const { pedido_id,metodo_pagamento,status } = req.body
        
        if (!pedido_id || !metodo_pagamento || !status) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        const result = Paymet.requestingPayment(pedido_id, metodo_pagamento, status)
        res.status(201).json({ message: 'Pagamento aprovado, obrigado pela compra' });
    } catch (error) {
    }
}

