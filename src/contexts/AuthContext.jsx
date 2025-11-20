/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      console.error("Erro ao fazer login:", err);

      // Mensagens de erro amigáveis
      let errorMessage = "Erro ao fazer login";

      switch (err.code) {
        case "auth/invalid-email":
          errorMessage = "E-mail inválido";
          break;
        case "auth/user-disabled":
          errorMessage = "Usuário desabilitado";
          break;
        case "auth/user-not-found":
          errorMessage = "Usuário não encontrado";
          break;
        case "auth/wrong-password":
          errorMessage = "Senha incorreta";
          break;
        case "auth/invalid-credential":
          errorMessage = "Credenciais inválidas";
          break;
        default:
          errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      setError("Erro ao fazer logout");
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: !!user, // Todos os usuários autenticados são admin por enquanto
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
