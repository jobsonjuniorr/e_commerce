import { Link, useNavigate } from "react-router"
import { useRef,FormEvent,useState,useEffect } from "react"
import ErrorNotification from "../../components/errroNotification"
import SuccessNotification from "../../components/sucessNotification"
import Image from "/assets/login.jpg"
import Api from "../../services/api.ts"


function Register (){
    const navigate = useNavigate()
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const telefoneRef = useRef<HTMLInputElement>(null)
    const senhaRef = useRef<HTMLInputElement>(null)
    const [error,setError] = useState<string | null>(null)
    const [sucess,setSuccess] = useState<string | null>(null)

    function clearInputs(){
        nameRef.current!.value = ""
        emailRef.current!.value = ""
        telefoneRef.current!.value = ""
        senhaRef.current!.value = ""
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        
        const nome = nameRef.current?.value.trim()
        const telefone = telefoneRef.current?.value.trim()
        const email = emailRef.current?.value.trim()
        const senha = senhaRef.current?.value.trim()

        if(!nome || !telefone || !email || !senha){
            setError("Preencha todos os campos")
            return
        } 

        try{
            const response = await Api.post("http://localhost:5000/api/register",{ 
                    nome,email,senha,telefone
            })
            if(response.status === 201){
                setSuccess("Usuário cadastrado com sucesso, redirecionando para Login")
                clearInputs()
                setTimeout(()=>{
                  navigate("/login")
                },5000)
                return
            }
        }catch(err : any){
            setError(err.response?.data?.error || "Erro no servidor");
        }
    }
    useEffect(() => {
      
    
        if (error) {
           const timeError = setTimeout(() => {
                setError(null);
            }, 3000);
            return () =>{clearTimeout(timeError)}
        }
    
        if (sucess) {
           const timeSucess = setTimeout(() => {
                setSuccess(null);
            }, 3000);
            return ()=>{clearTimeout(timeSucess)}
        }
    
    }, [error, sucess]);
    
    return(
        <div className="min-h-dvh flex flex-col md:flex-row items-center justify-center bg-background px-4 py-6">

  {/* Notificações */}
  {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
  {sucess && <SuccessNotification message={sucess} onClose={() => setSuccess(null)} />}

  {/* Formulário */}
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md md:max-w-sm bg-card p-6 md:h-[70vh] flex flex-col justify-center gap-6 rounded-l-3xl shadow-m"
  >
    <h2 className="text-3xl font-bold text-center text-headline">Cadastro</h2>

    <input
      ref={nameRef}
      type="text"
      placeholder="Nome"
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-red-400 text-headline"
    />

    <input
      ref={telefoneRef}
      type="text"
      placeholder="Telefone"
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-red-400 text-headline"
    />

    <input
      ref={emailRef}
      type="email"
      placeholder="Email"
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-red-400 text-headline"
    />

    <input
      ref={senhaRef}
      type="password"
      placeholder="Senha"
      autoComplete="current-password"
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-red-400 text-headline"
    />

    <button className="w-full py-2 rounded-md bg-new-button text-white font-semibold hover:bg-button-hover transition duration-200">
      Cadastrar-se
    </button>

    <p className="text-sm text-center text-headline">
      Já tem uma conta?{" "}
      <Link
        to="/login"
        className="text-new-button hover:underline"
      >
        Faça login!
      </Link>
    </p>
  </form>

  {/* Imagem */}
  <img
    src={Image}
    alt="Cadastro-Imagem"
    className="hidden md:block md:h-[40vh] lg:h-[50vh] xl:h-[60vh] 2xl:h-[70vh] object-contain ml-0 md:ml-0 rounded-r-2xl"
  />
</div>

    )
}

export default Register