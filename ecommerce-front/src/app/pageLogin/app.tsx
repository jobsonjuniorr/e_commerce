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
          

            if(response.data.user.tipo === 'admin'){
                localStorage.setItem("token", response.data.accessToken);
                localStorage.setItem("user",JSON.stringify(response.data.user))
                navigate("/productAdm")
            }else{
                localStorage.setItem("token", response.data.accessToken);
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
        <div className="h-dvh flex items-center justify-center flex-col md:flex-row">

            <img src={Image} alt="Login-Imagem" className="hidden md:block md:h-5/6" />
            {error && <ErrorNotification message={error} onClose={() => setError(null)}></ErrorNotification>}
            <form className="flex flex-col 2xl:h-2/6 p-6 gap-4 2xl:gap-9 2xl:4xl items-center justify-center h-full w-full md:h-5/6 md:w-2/6 bg-red-100" onSubmit={hadleSumit}>
                <h2 className="text-2xl font-bold  text-center text-paragraph 2xl:text-5xl">Login</h2>
                <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email"
                    className="w-4/5 md:w-full md:text-xl  xl:text-sm xl:w-4/5   bg-input px-3 py-2 2xl:p-3 2xl:text-4xl border border-gray-300 rounded-md focus:outline-none"
                />
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Senha"
                    className="w-4/5 md:w-full md:text-xl  xl:text-sm xl:w-4/5  px-3 bg-input py-2 border  2xl:p-3 2xl:text-4xl  border-gray-300 rounded-md focus:outline-none"
                />
                <button className="w-3/6 bg-button 2xl:p-3 2xl:text-4xl  py-2 px-4 rounded-md duration-200 bg-red-600 hover:bg-red-300">
                    Login
                </button>
                <p className="text-text w-full flex justify-center gap-2  2xl:text-4xl " >
                    Não tem uma conta?  <Link to="/register" className="text-text duration-200 hover:text-link hover:underline  block text-center">
                        Cadastre-se
                    </Link>
                </p>
            </form>

        </div>
    )
}

export default Login
