/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { Book, Globe, User, Home, LogIn, Settings, LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const publicMenuItems = [
    { icon: Home, label: "Início", path: "/" },
    { icon: Book, label: "Capítulos", path: "/chapters" },
    { icon: Globe, label: "Sobre Eldor", path: "/world" },
    { icon: User, label: "Sobre o Autor", path: "/author" },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <nav
        className={`sidebar ${isOpen ? "open" : ""} ${
          isDark ? "dark" : "light"
        }`}
      >
        <div className="sidebar-content">
          {/* Menu público */}
          {publicMenuItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              className="sidebar-item"
              onClick={() => handleNavigate(path)}
            >
              <Icon size={24} />
              <span>{label}</span>
            </button>
          ))}

          {/* Divisor */}
          <div className="sidebar-divider" />

          {/* Menu administrativo */}
          {isAuthenticated ? (
            <>
              <button
                className="sidebar-item admin"
                onClick={() => handleNavigate("/admin")}
              >
                <Settings size={24} />
                <span>Painel Admin</span>
              </button>
              <button className="sidebar-item logout" onClick={handleLogout}>
                <LogOut size={24} />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <button
              className="sidebar-item"
              onClick={() => handleNavigate("/login")}
            >
              <LogIn size={24} />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
