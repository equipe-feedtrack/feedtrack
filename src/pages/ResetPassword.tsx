import React, { useState } from "react";
import { Link } from "react-router-dom";

export const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState<{ tipo: "success" | "danger"; mensagem: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlerta(null);

    if (!email.trim()) {
      setAlerta({ tipo: "danger", mensagem: "O campo e-mail é obrigatório." });
      return;
    }

    // Validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlerta({ tipo: "danger", mensagem: "Digite um e-mail válido." });
      return;
    }

    setLoading(true);

    // Simula envio do email (API, backend etc)
    setTimeout(() => {
      setLoading(false);
      setAlerta({ tipo: "success", mensagem: "E-mail de recuperação enviado! Verifique sua caixa de entrada." });
      setEmail("");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Recuperar Senha
        </h1>

        {alerta && (
          <div
            className={`rounded-md px-4 py-3 text-sm font-medium mb-4 ${
              alerta.tipo === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {alerta.mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail cadastrado
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                       focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
            placeholder="seuemail@exemplo.com"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md
                       hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar e-mail de recuperação"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Lembrou a senha?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
};
