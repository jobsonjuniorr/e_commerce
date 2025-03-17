import { useEffect, useState } from "react";
import { Link } from "react-router";

function App() {

  interface Product {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    imagem: string; // Base64
  }
  const [produtos, setProdutos] =  useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/protegido/productAdm")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setProdutos(data))
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  return (
    <div>
      <section className="flex w-full items-center justify-between p-3 bg-amber-400">
        <h2>E-comm</h2>
        <div className="bg-red-200 w-md flex items-center justify-center rounded-2xl">
          <input className="p-2 focus:outline-none w-full" type="text" placeholder="Buscar" />
        </div>
        <div>
          <ul className="flex gap-3.5">
            <li><Link to={"/login"}>Login</Link></li>
            <li><Link to={"/carrinho"}>Carrinho</Link></li>
          </ul>
        </div>
      </section>

      {/* Exibição dos produtos */}
      <div className="grid grid-cols-3 gap-4 p-5">
        {produtos.map((product) => (
          
          <div key={product.id} className="border p-3 rounded-lg shadow-md">
           
            <img 
              src={product.imagem} 
              alt={product.nome} 
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-lg font-bold mt-2">{product.nome}</h3>
            <p className="text-sm text-gray-600">{product.descricao}</p>
            <p className="text-md font-semibold text-green-600">R$ {product.preco}</p>
            <button className="mt-2 p-2 bg-blue-500 text-white rounded">Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
