// src/contexts/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipos (sem alterações)
type User = {
  username: string;
  role: "admin" | "funcionario" | "master";
  name: string;
};

// ... (o resto dos seus tipos não precisa de alteração)
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isMaster: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


// --- INÍCIO DA SIMULAÇÃO DE API ---

// 1. Base de dados simulada (nosso objeto JSON)
const mockUsers = [
  {
    username: "admin",
    password: "admin123",
    role: "admin", // Com 'as const', TypeScript entende isto como o tipo "admin" e não "string"
    name: "Administrador do Sistema",
  },
  {
    username: "funcionario",
    password: "func123",
    role: "funcionario",
    name: "Colaborador Padrão",
  },
  {
    username: "master",
    password: "master123",
    role: "master",
    name: "Super Usuário",
  },
] as const; // A MUDANÇA ESTÁ AQUI 🚀

// ... (o resto do ficheiro permanece exatamente igual)

// 2. Função que simula a chamada à API
const mockApiLogin = (username: string, password: string): Promise<{ user: User, token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundUser = mockUsers.find(
        (user) => user.username === username && user.password === password
      );

      if (foundUser) {
        const { password, ...userToReturn } = foundUser;
        resolve({
          user: userToReturn, // Agora 'userToReturn' tem o tipo correto para 'role'
          token: `mock-jwt-token-for-${username}`,
        });
      } else {
        reject(new Error("Credenciais inválidas"));
      }
    }, 500);
  });
};

// --- FIM DA SIMULAÇÃO DE API ---

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // ... (Nenhuma alteração necessária aqui)
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const data = await mockApiLogin(username, password);
    const loggedUser: User = data.user;
    const token: string = data.token;
    localStorage.setItem("user", JSON.stringify(loggedUser));
    localStorage.setItem("authToken", token);
    setUser(loggedUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        isAdmin: user?.role === "admin",
        isEmployee: user?.role === "funcionario",
        isMaster: user?.role === "master",
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  // ... (Nenhuma alteração necessária aqui)
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};