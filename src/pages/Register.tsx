import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // Removido por enquanto, já que o cadastro não usa o contexto de autenticação diretamente

export const Register = () => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alerta, setAlerta] = useState<{ tipo: "success" | "danger"; mensagem: string } | null>(null);

  const navigate = useNavigate();
  // const { registerUser } = useAuth(); // Se houver uma função de registro no seu contexto de autenticação

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlerta(null);

    // Validações dos campos
    if (!nomeCompleto.trim()) {
      setAlerta({ tipo: "danger", mensagem: "O campo Nome Completo é obrigatório." });
      return;
    }
    if (!email.trim()) {
      setAlerta({ tipo: "danger", mensagem: "O campo Email é obrigatório." });
      return;
    }
    if (!usuario.trim()) {
      setAlerta({ tipo: "danger", mensagem: "O campo Usuário é obrigatório." });
      return;
    }
    if (!password.trim()) {
      setAlerta({ tipo: "danger", mensagem: "A Senha é obrigatória." });
      return;
    }
    if (password.length < 6) {
      setAlerta({ tipo: "danger", mensagem: "A Senha deve ter no mínimo 6 caracteres." });
      return;
    }
    if (password !== confirmPassword) {
      setAlerta({ tipo: "danger", mensagem: "As senhas não coincidem." });
      return;
    }

    try {
      // Aqui você faria a chamada para sua API de registro
      // Exemplo: await registerUser(nomeCompleto, email, usuario, password);

      // Simulação de registro bem-sucedido
      console.log("Dados para registro:", { nomeCompleto, email, usuario, password });
      setAlerta({ tipo: "success", mensagem: "Cadastro realizado com sucesso! Redirecionando para o login..." });
      
      // Redireciona para a tela de login após um pequeno atraso
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (error) {
      // Erro real da API
      // setAlerta({ tipo: "danger", mensagem: "Erro ao cadastrar. Tente novamente mais tarde." });
      
      // Simulação de erro (para testes)
      setAlerta({ tipo: "danger", mensagem: "Erro ao cadastrar. Usuário ou e-mail já em uso." });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 md:flex md:gap-8">
        {/* Imagem */}
        <div className="hidden md:flex items-center justify-center">
          <img src="./login.jpg" alt="Cadastro" className="w-[300px] h-[300px] object-cover rounded-md" />
        </div>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-center gap-4">
          <h1 className="text-2xl font-bold text-center text-blue-800">Crie sua conta no FeedTrack</h1>

          {alerta && (
            <div
              className={`rounded-md px-4 py-3 text-sm font-medium flex justify-between items-center ${
                alerta.tipo === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span>{alerta.mensagem}</span>
              <button
                type="button"
                onClick={() => setAlerta(null)}
                className="text-xl leading-none font-bold ml-2"
              >
                ×
              </button>
            </div>
          )}

          <div>
            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              id="nomeCompleto"
              type="text"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
              Usuário
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
          >
            Cadastrar
          </button>

          <p className="text-center text-sm text-gray-500 mt-3">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};