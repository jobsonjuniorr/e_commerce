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

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json(product);
    } catch (error) {
        console.error("Erro ao buscar produto por ID:", error);
        res.status(500).json({ error: "Erro ao buscar o produto" });
    }
};
