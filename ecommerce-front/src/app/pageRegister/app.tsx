import { Link } from "react-router"
import { useRef,FormEvent,useState,useEffect } from "react"
import ErrorNotification from "../../components/errroNotification"
import SuccessNotification from "../../components/sucessNotification"
import Image from "/assets/login.jpg"


function Register (){
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
            clearInputs()
            return
        } 

        try{
            const response = await fetch("http://localhost:5000/api/register",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,email,senha,telefone
                })
            })
            const data = await response.json();

            if(response.status === 201){
                setSuccess("Usuário cadastrado com sucesso")
                clearInputs()
                return
            }
            if(response.status === 409){
                setError(data.error)
                clearInputs()
                return
            }
            if(response.status === 500){
                setError("Erro ao cadastrar o usuário")
            }
        }catch(err){
            setError("Erro ao conectar com o servidor") 
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
        <div className="h-dvh flex items-center justify-center flex-col md:flex-row">

            
            {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
            {sucess && <SuccessNotification message={sucess} onClose={() => setSuccess(null)} />}  

            <form className="flex flex-col 2xl:h-2/6 p-6 gap-4 2xl:gap-9 2xl:4xl items-center justify-center h-full w-full md:h-5/6 md:w-2/6 bg-red-100" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold  text-center text-paragraph 2xl:text-5xl">Cadastro</h2>
            <input
              ref={nameRef}
              type="text"
              placeholder="Nome"
              className="w-4/5 md:w-full  md:text-xl  xl:text-sm xl:w-4/5   bg-input px-3 py-2 2xl:p-3 2xl:text-4xl border border-gray-300 rounded-md focus:outline-none"
            />
              <input
              ref={telefoneRef}
              type="text"
              placeholder="Telefone"
              className="w-4/5 md:w-full  md:text-xl  xl:text-sm xl:w-4/5   bg-input px-3 py-2 2xl:p-3 2xl:text-4xl border border-gray-300 rounded-md focus:outline-none"
            />
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="w-4/5 md:w-full md:text-xl  xl:text-sm xl:w-4/5   bg-input px-3 py-2 2xl:p-3 2xl:text-4xl border border-gray-300 rounded-md focus:outline-none"
            />
            <input
              ref={senhaRef}
              type="password"
              placeholder="Senha"
              className="w-4/5 md:w-full md:text-xl  xl:text-sm xl:w-4/5   bg-input px-3 py-2 2xl:p-3 2xl:text-4xl border border-gray-300 rounded-md focus:outline-none"
              autoComplete="current-password"
            />
            <button className="w-3/6 bg-button 2xl:p-3 2xl:text-4xl  py-2 px-4 rounded-md duration-200 bg-red-600 hover:bg-red-300">
              Cadastrar-se
            </button>
            <p className="text-text w-full flex justify-center gap-2  2xl:text-4xl " >
              Já tem uma conta?  <Link to="/login" className="text-text duration-200 hover:text-link hover:underline  block text-center">
                Faça login
              </Link>
            </p>
            </form>
            <img src={Image} alt="Login-Imagem" className="hidden md:block md:h-5/6" />
        </div>
    )
}

export default Register