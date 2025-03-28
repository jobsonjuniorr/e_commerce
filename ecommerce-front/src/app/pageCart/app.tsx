import { useEffect, useState } from "react";
import { Link } from "react-router";
import ErrorNotification from "../../components/errroNotification";
import SuccessNotification from "../../components/sucessNotification";

interface CartItem {
  id: number;
  produto_id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  imagem: string;
}
interface Product {
  id: number;
  nome: string;
  descricao: string;
  estoque: number;
  preco: number;
  categoria: string;
  imagem: string;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Você precisa estar logado para acessar o carrinho.");
      return;
    }

    fetch("http://localhost:5000/api/protegido/cart/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.cartItems) {
       
          setCartItems(data.cartItems);
        } else {
          setCartItems([]);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar o carrinho:", error);
        setError("Erro ao carregar o carrinho.");
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const user = JSON.parse(userData);
      setUser(user.nome);
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

  const handleRemoveItem = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/protegido/cart/deleteItemCart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao remover o item.");
      }

      setCartItems(cartItems.filter((item) => item.id !== id));
      setSucess("Item removido do carrinho com sucesso!");
    } catch (error: any) {
      setError(error.message || "Erro ao remover item do carrinho.");
    }
  };

  const handleUpdateQuantity = async (id: number, novaQuantidade: number, preco: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Você precisa estar logado para atualizar o carrinho.");
      return;
    }


    const itemNoCarrinho = cartItems.find((item) => item.id === id);
    if (!itemNoCarrinho) return;

    const produto = produtos.find((produto) => produto.id === itemNoCarrinho.produto_id);
    if (!produto) return;

    if (novaQuantidade > produto.estoque) {
      setError("Estoque insuficiente para adicionar mais itens.");
      return;
    }

    const precoTotal = preco * novaQuantidade;

    try {
      const response = await fetch("http://localhost:5000/api/protegido/cart/attItem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, quantidade: novaQuantidade, preco: precoTotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar a quantidade.");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantidade: novaQuantidade, precoTotal } : item
        )
      );
    } catch (error: any) {
      setError(error.message || "Erro ao atualizar a quantidade.");
    }
  };


  const handleClearCart = async () => {
    const token = localStorage.getItem("token");
    const usuario_id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).id : null;

    try {
      const response = await fetch("http://localhost:5000/api/protegido/cart/deleteItemAll", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao limpar o carrinho.");
      }

      setCartItems([]);
      setSucess("Todos os itens foram removidos do carrinho!");
    } catch (error: any) {
      setError(error.message || "Erro ao limpar o carrinho.");
    }
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
  return (
    <div>
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      {sucess && <SuccessNotification message={sucess} onClose={() => setSucess(null)} />}

      <section className="p-5">
        <h2 className="text-2xl font-bold mb-4">Carrinho de Compras</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border p-3 rounded-lg shadow-md flex items-center gap-4">
                  <img src={item.imagem} alt={item.nome} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{item.nome}</h3>
                    <p className="text-sm text-gray-600">{item.descricao}</p>
                    <p className="text-md font-semibold text-green-600">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded bg-blue-500 text-white"
                        onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1, item.preco)}
                        disabled={item.quantidade <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantidade}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1, item.preco)}
                        disabled={item.quantidade >= (produtos.find((p) => p.id === item.produto_id)?.estoque || 0)}
                        className={`p-2 rounded ${item.quantidade >= (produtos.find((p) => p.id === item.produto_id)?.estoque || 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="p-2 bg-red-500 text-white rounded"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
           <div className="flex gap-2">
           <button
              className="mt-4 p-3 bg-red-600 text-white rounded"
              onClick={handleClearCart}
            >
              Limpar Carrinho
            </button>
            <Link to={"/address"}><button className="mt-4 p-3 bg-blue-500 text-white rounded">Área de pagamento</button></Link>
           </div>
          </>
        )}
      </section>

      <Link to="/" className="block text-center mt-5 text-blue-500 ">
        Voltar para a loja
      </Link>
      
   
    </div>
  );
}

export default Cart;
