import { Link } from "react-router"

function App() {
  return (
    <div>
      <section className="flex w-full  items-center justify-between p-3 bg-amber-400">
      
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
    </div>
  )
}

export default App
