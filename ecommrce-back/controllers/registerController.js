import User from "../models/registerModel.js"


export const registerUser = async(req,res) =>{
    try{
        const {nome,email,senha,telefone} =  req.body;

       if(!nome || !email || !senha || !telefone){
        return res.status(400).json({error:"Todas os campos são obrigatorios"})
     }

      const response = await User.postRegisterUser(nome,email,senha,telefone)
     
      if(response.error){
        return res.status(409).json({error:response.error})
      }

        return res.status(201).json({error:"Usuario cadastrados com sucesso"})
    }catch(error){
        res.status(500).json({error:"Erro ao tentar cadastrar o usuario"})
    }
}

export const registerUserType = async(req,res) =>{
  try{
      const {nome,email,senha,telefone,tipo} =  req.body;
      

     if(!nome || !email || !senha || !telefone || !tipo){
      return res.status(400).json({error:"Todas os campos são obrigatorios"})
   }

    const response = await User.postRegisterType(nome,email,senha,telefone,tipo)
   
    if(response.error){
      return res.status(409).json({error:response.error})
    }

      return res.status(201).json({error:"Usuario cadastrados com sucesso"})
  }catch(error){
      res.status(500).json({error:"Erro ao tentar cadastrar o usuario"})
  }
}