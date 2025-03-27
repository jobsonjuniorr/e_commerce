import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
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

interface Address {
  id: number;
  usuario_id: number;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: number;
}

interface Order {
  id: number;
  usuario_id: number;
  total: number;
  status: string;
  endereco_id: number;
}

function Payment() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<Address | null>(null);
  const [order, setOrder] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("pix");

  const navigate = useNavigate();

  // Carregar os itens do carrinho
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Você precisa estar logado para acessar o carrinho.");
      return;
    }

    fetch("http://localhost:5000/api/protegido/cart/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setCartItems(data.cartItems || []))
      .catch(() => setError("Erro ao carregar o carrinho."));
  }, []);

  // Carregar os pedidos do usuário
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    fetch("http://localhost:5000/api/protegido/order/getItem", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrder(data.result || []);
        if (data.result.length > 0) {
           const ultimo = data.result[data.result.length -1]
           fetchSelectedAddress(ultimo.endereco_id)
        }
    })
      .catch(() => setError("Erro ao carregar os pedidos."));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData).id);
    }
  }, []);

  const fetchSelectedAddress = async (enderecoId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/protegido/enderecos/paymet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: enderecoId }),
      });

      const data = await response.json();
      setSelectedAddressDetails(data.getItem[0] || null);
    } catch (error) {
      console.error("Erro ao buscar o endereço selecionado:", error);
    }
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!order.length) {
      setError("Nenhum pedido encontrado.");
      return;
    }

    const pedido_id = order[order.length -1].id;
    const status = "aprovado"; 

    try {
      const response = await fetch("http://localhost:5000/api/protegido/paymet/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pedido_id, metodo_pagamento: metodoPagamento, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento.");
      }

      setSucess("Pagamento realizado com sucesso!");
      await clearCart();  
    } catch (error: any) {
      setError(error.message);
    }
  };


  const clearCart = async () => {
    const token = localStorage.getItem("token");

    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/protegido/cart/deleteItemAll", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_id: user }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao limpar o carrinho.");
      }

      setCartItems([]);
      setTimeout(() => navigate("/"), 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      {sucess && <SuccessNotification message={sucess} onClose={() => setSucess(null)} />}

      <section className="p-5">
        <h2 className="text-lg font-bold">Resumo do Pedido</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="border p-3 rounded-lg shadow-md flex items-center gap-4 w-2/6">
              <img src={item.imagem} alt={item.nome} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{item.nome}</h3>
                <p className="text-md font-semibold text-green-600">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedAddressDetails && (
        <div className="p-5">
          <h2 className="text-lg font-bold">Endereço Selecionado:</h2>
          <p>Rua: {selectedAddressDetails.rua}</p>
          <p>CEP: {selectedAddressDetails.cep}</p>
          <p>CIDADE: {selectedAddressDetails.cidade}</p>
          <p>Número: {selectedAddressDetails.numero}</p>
        </div>
      )}

      <div className="p-5">
        <h2 className="text-lg font-bold">Escolha o Método de Pagamento</h2>
        <select
          className="border p-2 rounded w-full md:w-1/3"
          value={metodoPagamento}
          onChange={(e) => setMetodoPagamento(e.target.value)}
        >
          <option value="pix">Pix</option>
          <option value="cartao_credito">Cartão de Crédito</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white p-2 rounded mt-4 w-full md:w-1/3"
      >
        Confirmar Pagamento
      </button>

      <Link to="/cart" className="block text-center mt-5 text-blue-500">
        Voltar para o carrinho
      </Link>
    </div>
  );
}

export default Payment;
