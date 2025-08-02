import { useNavigate, Link } from "react-router"
import Image from "/assets/login.jpg"
import { FormEvent, useEffect, useRef, useState } from "react"
import ErrorNotification from "../../components/errroNotification"
import Api from "../../services/api"


function Login() {
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    async function hadleSumit(event: FormEvent) {
        event.preventDefault();
    
        const email = emailRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();
       
        if (!email || !password) {
            setError("Campos não preenchidos");
            return;
        }
    
        try {
            const response = await Api.post("http://localhost:5000/api/login", { email, password });
            const now = Date.now()
            localStorage.setItem("token_created_at", now.toString());

            if(response.data.user.tipo === 'admin'){
                localStorage.setItem("token", response.data.accessToken);
                localStorage.setItem("token_created_at", now.toString());
                localStorage.setItem("user",JSON.stringify(response.data.user))
                navigate("/productAdm")
            }else{
                localStorage.setItem("token", response.data.accessToken);
                localStorage.setItem("token_created_at", now.toString());
                localStorage.setItem("user",JSON.stringify(response.data.user))
                navigate("/")
            }          
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro no servidor");
        }
    }
    useEffect(() => {
        if (error) {
            const timeoutId = setTimeout(() => {
                setError(null);
            }, 3000)
            return () => clearTimeout(timeoutId)
        }

    }, [error])
    return (
       <div className="min-h-dvh flex flex-col md:flex-row items-center justify-center">
  <img
    src={Image}
    alt="Login-Imagem"
    className="hidden md:block md:h-[40vh] lg:h-[50vh] xl:h-[60vh] 2xl:h-[70vh] object-contain rounded-l-2xl"
  />

  {error && (
    <ErrorNotification
      message={error}
      onClose={() => setError(null)}
    />
  )}

  <form
    onSubmit={hadleSumit}
    className="w-full max-w-md md:max-w-sm bg-card p-6 md:h-[70vh] flex flex-col justify-center gap-6 rounded-r-2xl shadow-md"
  >
    <h2 className="text-3xl font-bold text-center text-headline">Login</h2>

    <input
      ref={emailRef}
      type="email"
      placeholder="Email"
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-red-400 text-headline"
    />

    <input
      ref={passwordRef}
      type="password"
      placeholder="Senha"
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-red-400 text-headline"
    />

    <button className="w-full py-2 rounded-md bg-new-button text-white font-semibold hover:bg-button-hover transition duration-200">
      Login
    </button>

    <p className="text-sm text-center text-headline">
      Não tem uma conta?{" "}
      <Link
        to="/register"
        className="text-header hover:underline"
      >
        Cadastre-se
      </Link>
    </p>
  </form>
</div>

    )
}

export default Login
