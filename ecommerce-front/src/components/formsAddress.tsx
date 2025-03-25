import { useState } from "react";

function AddressForm({ onAddAddress }: { onAddAddress: () => void }) {
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Você precisa estar logado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/protegido/enderecos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rua, numero, complemento, bairro, cidade, estado, cep, padrao: false }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar endereço.");
      }

      onAddAddress();
      setRua("");
      setNumero("");
      setComplemento("");
      setBairro("");
      setCidade("");
      setEstado("");
      setCep("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-md mt-4">
      {error && <p className="text-red-500">{error}</p>}
      <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua" required />
      <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número" required />
      <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Complemento" />
      <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" required />
      <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" required />
      <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" required />
      <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" required />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
        Adicionar Endereço
      </button>
    </form>
  );
}

export default AddressForm