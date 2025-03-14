import Products from "./app/pagaProdutct/App.tsx"
import Login from "./app/pageLogin/app.tsx"
import Register from "./app/pageRegister/app.tsx";

import { BrowserRouter as Router, Routes, Route } from 'react-router';

function App() {
  return (
  <Router>
   
    <Routes>
      <Route path="/" element={<Products/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
    </Routes>
  </Router>
  )
}

export default App