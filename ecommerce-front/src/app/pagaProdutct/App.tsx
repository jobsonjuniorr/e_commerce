import { useEffect, useState } from "react";
import { Link } from "react-router";
import ErrorNotification from "../../components/errroNotification";
import SuccessNotification from "../../components/sucessNotification";
import { useNavigate } from "react-router";

function App() {
  interface Product {
    id: number;
    nome: string;
    descricao: string;
    estoque:number;
    preco: number;
    categoria: string;
    imagem: string;
  }
  interface CartItem {
    id: number;
    produto_id: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem: string;
  }
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const navigate = useNavigate()

  const fetchCart = () => {
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
        setCartItems(data.cartItems || []);
      })
      .catch((error) => {
        console.error("Erro ao buscar o carrinho:", error);
        setError("Erro ao carregar o carrinho.");
      });
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCart();
    }
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
 

  const handleAddToCart = async (produto_id: number) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!userData) {
      setError("Você precisa estar logado para adicionar itens ao carrinho.");
      return;
    }

    const usuario_id = JSON.parse(userData).id;

    try {

      const checkResponse = await fetch(
        `http://localhost:5000/api/protegido/cart/verificCart?usuario_id=${usuario_id}&produto_id=${produto_id}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.getItem.length > 0) {
        setError("Este item já está no seu carrinho.");
        return;
      }

      const addResponse = await fetch("http://localhost:5000/api/protegido/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_id, produto_id }),
      });

      const addData = await addResponse.json();

      if (!addResponse.ok) {
        throw new Error(addData.error || "Erro ao adicionar ao carrinho.");
      }
      setSucess("Produto adicionado ao carrinho com sucesso!");
      fetchCart()
    } catch (error: any) {
      if(error.message === "Sessão expirada, faça login novamente."){
        setError("Sessão expirada, faça login novamente.")
        localStorage.clear()
        navigate("/login")
      }else{
        setError(error.message || "Erro ao adicionar ao carrinho.");
      }
    }

  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const filteredProducts = produtos.filter((product) =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

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
    <div className="bg-background h-full">
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      {sucess && <SuccessNotification message={sucess} onClose={() => setSucess(null)} />}

      <section className="flex w-full items-center justify-between p-3.5 bg-header gap-2 md:gap-0">
        <h2 className="text-headline text-lg  hidden md:block">E-comm</h2>

        <div className="bg-inputs text-paragraph w-md flex items-center justify-center rounded-2xl">
          <input
            className="p-2 focus:outline-none w-full"
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
          />

        </div>
        <div>
          <ul className="flex gap-3.5 sm:p-1 md:p-0 ">
            {user ? (
              <li className="text-headline text-lg hover:underline"><Link to={"config"}>{user}</Link></li>
            ) : (
              <li className="text-headline text-lg">
                <Link to={"/login"}>Login</Link>
              </li>
            )}
            <li className="text-headline text-lg hover:underline ">
             {cartItems.length > 0  ?(
               <Link  to={"/cart"} className="flex items-center justify-center">
              <span className="material-symbols-outlined ">
               shopping_cart
               </span>
              <span className="absolute mb-8 ml-6 text-headline font-bold"> {cartItems.length}
              </span>
               </Link>
             ): <Link to={"/cart"}><span className="material-symbols-outlined">
             shopping_cart
             </span></Link>}
            </li>
          </ul>
        </div>
      </section>

      <div className="grid md:grid-cols-5 sm:grid-cols-1 gap-2 p-5">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border md:w-64 p-3 rounded-lg shadow-md bg-card">
            <img
              src={product.imagem}
              alt={product.nome}
              className="w-full h-64 object-contain rounded-xl"
            />
            <h3 className="text-lg font-bold mt-2 text-headline capitalize">{product.nome}</h3>
            <p className="text-sm text-paragraph capitalize">{product.descricao}</p>
            <p className="text-sm text-headline flex gap-1.5 ">Estoque: <strong className="text-sm text-alert-stock"> {product.estoque <= 0 ? `Indisponivel` : product.estoque}</strong></p>
            <p className="text-base font-semibold text-green-600">R$ {product.preco}</p>
            <button
              className={`mt-2 p-2 rounded ${product.estoque <= 0 ? 'bg-gray-400 cursor-not-allowed' :'bg-new-button hover:bg-button-hover text-text-button'}`}
              onClick={() => handleAddToCart(product.id)}
              disabled = {product.estoque <=0}
            >
              Adicionar ao carrinho
            </button> 
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
