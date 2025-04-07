import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import ErrorNotification from "../../components/errroNotification";
import SuccessNotification from "../../components/sucessNotification";
import AddressForm from "../../components/formsAddress";

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
  cep: string;
}


function Address() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("pix");
  const [user, setUser] = useState<string | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const fetchAddresses = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/protegido/enderecos/visualizacao", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setAddress(data.getItem || []))
      .catch(() => console.error("Erro ao carregar os endereços."));
  }


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
      setUser(user.id);
    }

  }, [])
  const handleAddressSelect = (id: number) => {
    setSelectedAddress(id);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);


  const handlePayment = async () => {
    const total = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const token = localStorage.getItem("token");

    if (!selectedAddress) return;

    try {
      const orderResponse = await fetch("http://localhost:5000/api/protegido/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario_id: user,
          total,
          status: "pendente",
          endereco_id: selectedAddress,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Erro ao criar o pedido.");
      }

      const pedido_id = orderData.id;

      const paymentResponse = await fetch("http://localhost:5000/api/protegido/paymet/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pedido_id,
          metodo_pagamento: metodoPagamento,
          status: "aprovado",
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Erro ao processar pagamento.");
      }

      for (const item of cartItems) {
        const subStockResponse = await fetch("http://localhost:5000/api/protegido/subtritionStock", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: item.produto_id,
            quantidade: item.quantidade
          }),
        });

        const subStockData = await subStockResponse.json();

        if (!subStockResponse.ok) {
          throw new Error(subStockData.error || "Erro ao tentar atualizar estoque");
        }
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
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ">
          {cartItems.map((item) => (
            <div key={item.id} className="border p-3 rounded-lg shadow-md flex items-center gap-4 w-2/6 bg-card">
              <img src={item.imagem} alt={item.nome} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-headline capitalize">{item.nome}</h3>

                <div className="flex items-center gap-2">
                  <span className="text-paragraph-white  text-base flex">Quantidade:<p className="text-alert-stock ml-0.5 font-bold text-base">{item.quantidade}</p></span>
                </div>
                <p className="text-md font-semibold text-green-600">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
        </div>
      </section>
      <div className="p-3">
        <h2 className="text-lg font-bold text-headline">Selecione um endereço:</h2>
        <div className="p-1">
          {address.length === 0 ? (
            <p>Você ainda não tem endereços cadastrados.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 ">
              {address.map((item) => (
                <label
                  key={item.id}
                  className={`border p-3 rounded-lg shadow-md flex items-center gap-4 cursor-pointer bg-card ${selectedAddress === item.id ? "border-borde-orange" : ""
                    }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={item.id}
                    checked={selectedAddress === item.id}
                    onChange={() => handleAddressSelect(item.id)}
                  />
                  <div className="">
                    <h3 className="text-lg font-bold text-paragraph-white">
                      {item.rua}, {item.numero}
                    </h3>
                    <p className="text-paragraph-white text-base">{item.bairro} - {item.cidade}/{item.estado}</p>
                    <p className="text-paragraph text-base">CEP: {item.cep}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3">

          <button onClick={() => setShow(!show)} className="bg-new-button w-2xs text-text-button text-base font-semibold p-3 rounded mt-5">
            {show ? "Fechar Formulário" : "Adicionar Novo Endereço"}

          </button>
        </div>

        {show && <AddressForm onAddAddress={fetchAddresses} />}
      </div>

      <div className="p-3 flex flex-col">
        <h2 className="text-lg font-bold text-headline">Escolha o Método de Pagamento</h2>
        <select
          className="border border-white-border text-paragraph-white p-2 rounded w-full md:w-1/3"
          value={metodoPagamento}
          onChange={(e) => setMetodoPagamento(e.target.value)}
        >
          <option className="text-black" value="pix">Pix</option>
          <option className="text-black" value="cartao_credito">Cartão de Crédito</option>
          <option className="text-black" value="boleto">Boleto</option>
        </select>

        <button
        onClick={handlePayment}
        className="bg-new-button text-white p-2 rounded mt-4 w-full md:w-2xs"
      >
        Confirmar Pagamento
      </button>
      </div>

      <Link to="/cart" className="block text-center mt-2 text-alert-stock ">
        Voltar para o carrinho
      </Link>
    </div>
  );
}

export default Address;
