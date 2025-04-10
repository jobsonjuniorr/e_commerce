import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SuccessNotification from "../../components/sucessNotification";
import ErrorNotification from "../../components/errroNotification";
import EditProductPopup from "../../components/popup";
import { useNavigate } from "react-router";

const ProductAdmin: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState<number | string>("");
  const [estoque, setEstoque] = useState<number | string>("");
  const [categoria, setCategoria] = useState("blusa");
  const [imagem, setImagem] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate()
  const clearFields = () => {
    setNome("");
    setDescricao("");
    setPreco("");
    setEstoque("");
    setCategoria("blusa");
    setImagem(null);
    setError(null);
    setSucess(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  };

  const loadProducts = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get("http://localhost:5000/api/protegido/productAdm", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProdutos(response.data);
    } catch (error) {
      setError("Erro ao carregar produtos");
    }
  };
  const updateProduct = async (updatedProduct: any) => {
    try {
      await axios.put(
        `http://localhost:5000/api/protegido/updateProduct/${updatedProduct.id}`,
        updatedProduct
      );
      setSucess("Produto atualizado com sucesso");
      loadProducts();
    } catch (error) {
      setError("Erro ao atualizar produto");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", preco.toString());
    formData.append("estoque", estoque.toString());
    formData.append("categoria", categoria);
    if (imagem) formData.append("imagem", imagem);

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:5000/api/protegido/produtctAdm",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setSucess("Produto inserido com sucesso");

        setTimeout(() => {
          clearFields();
          loadProducts();
        }, 2000);
      }
    } catch (error) {
      setError("Erro ao inserir produto");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagem(e.target.files[0]);
    }
  };


  const deleteProduct = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/protegido/deleteProduct/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setSucess("Produto excluído com sucesso");
      loadProducts();
    } catch (error) {
      setError("Erro ao excluir produto");
    }
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setIsEditPopupOpen(true);
  };

  useEffect(() => {
    if (error) {
      const timeError = setTimeout(() => {
        setError(null)
      }, 3000)
      return () => { clearTimeout(timeError) }
    }
    if (sucess) {
      const timeSucess = setTimeout(() => {
        setSucess(null)
      }, 3000)
      return () => { clearTimeout(timeSucess) }
    }
  }, [error, sucess])


  useEffect(() => {
    const token = localStorage.getItem("token")
    const dateUser: string = localStorage.getItem("user") || ""
    const user = dateUser ? JSON.parse(dateUser) : {}

    if (!token && !dateUser) {
      navigate("/login")
    } else if (user.tipo === "cliente") {
      navigate("/")
    }
  })
  return (
    <div>
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      {sucess && <SuccessNotification message={sucess} onClose={() => setSucess(null)} />}
      <div className="max-w-full mx-auto p-6 bg-background shadow-lg">

        <h2 className="text-2xl font-semibold text-headline mb-6">Adicionar Produto</h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex-col">
            <div className="w-lg">
              <label className="block text-paragraph-white font-medium">Nome:</label>
              <input
                type="text"
                maxLength={50}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="mt-1 p-2 text-paragraph-white bg-card border border-gray-300 rounded w-full focus:outline-none"
              />
            </div>
            <div className="w-lg">
              <label className="block text-paragraph-white  font-medium">Preço:</label>
              <input
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
                className="mt-1 p-2 bg-card text-paragraph-white border border-gray-300 rounded w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-col">
            <div className="w-full ">
              <div className="w-lg">
                <label className="block text-paragraph-white  font-medium">Estoque:</label>
                <input
                  type="number"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  required
                  className="mt-1 p-2 bg-card text-paragraph-white border border-gray-300 rounded w-full focus:outline-none"
                />
              </div>

              <div className="w-lg">
                <label className="block text-paragraph-white  font-medium">Categoria:</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                  className="mt-1 p-2 bg-card text-paragraph-white  border border-gray-300 rounded w-full "
                >
                  <option value="blusa">Blusa</option>
                  <option value="calca">Calça</option>
                </select>
              </div>

            </div>
            <div className="w-xl">
              <label className="block text-paragraph-white font-medium">Descrição:</label>
              <textarea
                maxLength={100}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                className="mt-1 p-2 bg-card border text-paragraph-white border-gray-300 rounded w-full focus:outline-none"
              />
            </div>

          </div>

          <div>
            <label className="block text-paragraph-white  font-medium">Imagem:</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              required
              className="mt-1 p-2 border w-xl  bg-card text-paragraph-white border-gray-300 rounded focus:outline-none"
            />
          </div>

          <button
            className="w-lg bg-new-button text-white py-3 rounded-lg hover:bg-button-hover transition duration-200"
            type="submit"
          >
            Adicionar Produto
          </button>
        </form>

        <h2 className="text-2xl font-semibold text-headline mt-12 mb-6">Lista de Produtos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((product) => (
            <div key={product.id} className="bg-card shadow-md rounded-lg p-4">
              <img
                src={product.imagem}
                alt={product.nome}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold text-paragraph-white mt-4">{product.nome}</h3>
              <p className="text-paragraph-white  mt-2">{product.descricao}</p>
              <p className="text-paragraph-white 0 font-semibold mt-2">R$ {product.preco}</p>
              <p className="text-paragraph-white mt-1">Estoque: <span className="text-alert-stock">{product.estoque}</span></p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-500 text-paragraph-white  p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-paragraph-white p-2 rounded hover:bg-red-600 transition duration-200"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {isEditPopupOpen && selectedProduct && (
          <EditProductPopup
            product={selectedProduct}
            onClose={() => setIsEditPopupOpen(false)}
            onUpdate={(updatedProduct) => {
              updateProduct(updatedProduct);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductAdmin;
