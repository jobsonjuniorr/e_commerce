import Product from "../models/productModel.js";

export const createProduct = async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, categoria, imagem } = req.body;

        if (!nome || !descricao || !preco || !estoque || !categoria) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        if (isNaN(preco) || preco <= 0) {
            return res.status(400).json({ error: "Preço deve ser um número positivo" });
        }
        if (isNaN(estoque) || estoque < 0) {
            return res.status(400).json({ error: "Estoque deve ser um número igual ou maior que zero" });
        }

        const validCategorias = ["blusa", "calca"];
        if (!validCategorias.includes(categoria)) {
            return res.status(400).json({ error: "Categoria inválida! Escolha entre 'blusa' ou 'calca'." });
        }


        const urlRegex = /(http[s]?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/i;
        if (imagem && !urlRegex.test(imagem)) {
            return res.status(400).json({ error: "Imagem inválida! Deve ser uma URL válida de imagem." });
        }

        const novoProduto = await Product.addProduct(nome, descricao, preco, estoque, categoria, imagem);
        res.status(201).json({ message: "Produto adicionado com sucesso!", produto: novoProduto });

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.getProducts(); 
        res.json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ error: "Erro ao buscar os produtos" });
    }
};


export const deleteProduct = async(req,res) =>{
    try{
        const {id} = req.params

        if(!id){
            return res.status(404).json({message:"Produto não encontrado"})
        }
        const deleteProduct = await Product.deleteProduct(id) 
        
        res.status(200).json({message:"Item deletado com sucesso"})
    }catch(error){
        res.status(500).json({error:"Erro ao deletar produto"})
    }
}

export const criarProduto = (req, res) => {
   try{
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const imagem = req.file ? req.file.buffer : null; 

    if(!nome || !descricao || !preco ||!estoque || !categoria || !imagem){
       return res.status(400).json({message:"Todos os campos precisão ser preenchidos"})
    }

      const result = Product.inserirProduto(nome, descricao, preco, estoque, categoria, imagem)
      res.status(201).json({ message: 'Produto inserido com sucesso'});

   }catch(error){
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar o produto" });
   }
  };

  export const updateProductAdm = async (req, res) => {
    try {
      const { nome, descricao, preco, estoque, categoria } = req.body;
      const id = req.params.id; 

   
      const imagem = req.file ? req.file.buffer : null; 
      const result = await Product.updateProduct(id, nome, descricao, preco, estoque, categoria, imagem);
  
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Produto atualizado com sucesso" });
      } else {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar o produto" });
    }
  };