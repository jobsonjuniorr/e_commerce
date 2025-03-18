import React, { useState } from "react";
import axios from "axios";

interface EditProductPopupProps {
    product: any;
    onClose: () => void;
    onUpdate: (updatedProduct: any) => void; 
  }

const EditProductPopup: React.FC<EditProductPopupProps> = ({ product, onClose, onUpdate }) => {
  const [nome, setNome] = useState(product.nome);
  const [descricao, setDescricao] = useState(product.descricao);
  const [preco, setPreco] = useState<number | string>(product.preco);
  const [estoque, setEstoque] = useState<number | string>(product.estoque);
  const [categoria, setCategoria] = useState(product.categoria);
  const [imagem, setImagem] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagem(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    const updatedProduct = {
      id: product.id,
      nome,
      descricao,
      preco,
      estoque,
      categoria,
      imagem,
    };
  
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", preco.toString());
    formData.append("estoque", estoque.toString());
    formData.append("categoria", categoria);
    if (imagem) formData.append("imagem", imagem);
  
    try {
      await axios.put(`http://localhost:5000/api/protegido/updateProduct/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      onUpdate(updatedProduct); // Agora passando os dados do produto atualizado
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar produto", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Produto</h2>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <input type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2 border rounded mb-2">
          <option value="blusa">Blusa</option>
          <option value="calca">Calça</option>
        </select>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded mb-2" />
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductPopup;
