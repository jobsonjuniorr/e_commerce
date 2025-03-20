import Products from "./app/pagaProdutct/App.tsx"
import Login from "./app/pageLogin/app.tsx"
import Register from "./app/pageRegister/app.tsx";
import ProductForm from "./app/admProducts/page.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Cart from "./app/pageCart/app.tsx";
import Config from "./app/confpage/app.tsx";

function App() {
  return (
  <Router>
   
    <Routes>
      <Route path="/" element={<Products/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/productAdm" element={<ProductForm/>}/>
      <Route path="/cart" element={<Cart/>} />
      <Route path="/config" element={<Config/>} />
    </Routes>
  </Router>
  )
}

export default App