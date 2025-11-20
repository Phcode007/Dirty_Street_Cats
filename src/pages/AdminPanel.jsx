import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useCollection } from "../hooks/useFirestore";
import { BookOpen, Settings, LogOut, Plus } from "lucide-react";
import ChapterManager from "../features/admin/ChapterManager";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const { documents: chapters } = useCollection("chapters", "order");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className={`admin-panel ${isDark ? "dark" : "light"}`}>
      {/* Header do Admin */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <Settings size={28} />
            <h1>Painel Administrativo</h1>
          </div>

          <div className="admin-user-info">
            <span className="user-email">{user?.email}</span>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="admin-stats">
        <div className="stat-card">
          <BookOpen size={32} />
          <div className="stat-info">
            <h3>Capítulos</h3>
            <p className="stat-number">{chapters.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <Plus size={32} />
          <div className="stat-info">
            <h3>Publicados</h3>
            <p className="stat-number">
              {chapters.filter((ch) => ch.published).length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <Settings size={32} />
          <div className="stat-info">
            <h3>Rascunhos</h3>
            <p className="stat-number">
              {chapters.filter((ch) => !ch.published).length}
            </p>
          </div>
        </div>
      </div>

      {/* Gerenciador de Capítulos */}
      <div className="admin-content">
        <ChapterManager />
      </div>
    </div>
  );
};

export default AdminPanel;
