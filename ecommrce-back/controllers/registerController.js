import User from "../models/registerModel.js"


export const registerUser = async(req,res) =>{
    try{
        const {nome,email,senha,telefone} =  req.body;

       if(!nome || !email || !senha || !telefone){
        return res.status(400).json({error:"Todas os campos são obrigatorios"})
    }
        await User.postRegisterUser(nome,email,senha,telefone)
        res.status(201).json({message:"Usuario cadastrados com sucesso"})
    }catch(error){
        res.status(500).json({error:"Erro ao tentar cadastrar o usuario"})
    }
}