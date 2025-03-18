import { useEffect, useState } from "react";
import { Link } from "react-router";
import ErrorNotification from "../../components/errroNotification";
import SuccessNotification from "../../components/sucessNotification";

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
  const [user, setUser] = useState<string | null>(null);
  const [error,setError] = useState<string | null>(null)
  const [sucess,setSucess] = useState<string | null>(null)
  
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if(token && userData){
      const user = JSON.parse(userData)
      setUser(user.nome)
    }

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

  const handleAddToCart = () =>{
    if(!user){
      setError("Você precisa estar logado para adicionar itens ao carrinho.")
    }
  }
  return (
    <div>
      {error && <ErrorNotification message={error} onClose={()=>{setError(null)}}/>}
      {sucess && <SuccessNotification message={sucess} onClose={()=>{setSucess(null)}}/>}
      <section className="flex w-full items-center justify-between p-3 bg-amber-400">
        <h2>E-comm</h2>
        <div className="bg-red-200 w-md flex items-center justify-center rounded-2xl">
          <input className="p-2 focus:outline-none w-full" type="text" placeholder="Buscar" />
        </div>
        <div>
          <ul className="flex gap-3.5">
            {user ?(
              <li>{user}</li>
            ):(<li><Link to={"/login"}>Login</Link></li>)}
          
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
            <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={handleAddToCart}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
