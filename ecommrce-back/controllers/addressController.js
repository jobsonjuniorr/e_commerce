import Address from "../models/addressModel.js";

export const registerAddress = async (req, res) => {
    try {
        const { rua, numero, complemento, bairro, cidade, estado, cep, padrao } = req.body;
        const usuario_id = req.usuario.id; 

        if (!rua || !numero || !bairro || !cidade || !estado || !cep) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        await Address.postAddress(usuario_id, rua, numero, complemento, bairro, cidade, estado, cep, padrao);

        res.status(201).json({ message: "Endereço cadastrado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao tentar cadastrar o endereço." });
    }
};

export const getAddress = async(req,res) =>{
    try{
        const usuario_id = req.usuario.id

        if (!usuario_id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
  
        const getItem = await Address.getAddress(usuario_id)
      
        res.status(200).json({
            getItem
        });
    }catch(error){
        console.error("Erro ao listar o carrinho:", error);
        res.status(500).json({ 
            error: "Erro interno do servidor", 
            details: error.message 
        });
    }
}