import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

// Tipo para o usuário
type User = {
  username: string;
  role: "admin" | "funcionario" | "master";
  name: string;
};

// Tipo para o contexto de autenticação
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isMaster: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

// Props do provedor
type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    if (username === "admin" && password === "admin123") {
      setUser({ username: "admin", role: "admin", name: "Administrador" });
      return true;
    } else if (username === "funcionario" && password === "func123") {
      setUser({ username: "funcionario", role: "funcionario", name: "Funcionário" });
      return true;
    } else if (username === "master" && password === "master123") {
      setUser({ username: "master", role: "master", name: "Master" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isEmployee: user?.role === "funcionario",
        isMaster: user?.role === "master",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
