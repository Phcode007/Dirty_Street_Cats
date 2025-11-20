import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ArrowUp } from "lucide-react";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProgressBar from "./components/ProgressBar";
import ThemeToggle from "./components/ThemeToggle";
import FontSizeControl from "./components/FontSizeControl";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import ChapterList from "./pages/ChapterList";
import ChapterReader from "./pages/ChapterReader";
import WorldInfo from "./pages/WorldInfo";
import AuthorInfo from "./pages/AuthorInfo";
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/AdminPanel";

import "./styles/global.css";
import "./App.css";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Verificar se está na página de leitura
  const isReading = location.pathname.startsWith("/read/");

  // Verificar se está na página de login (não mostrar footer)
  const isLoginPage = location.pathname === "/login";

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="app">
          <ProgressBar />

          <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />

          <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chapters" element={<ChapterList />} />
              <Route path="/read/:id" element={<ChapterReader />} />
              <Route path="/world" element={<WorldInfo />} />
              <Route path="/author" element={<AuthorInfo />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer - não mostrar na página de login */}
          {!isLoginPage && <Footer />}

          {/* Controles flutuantes */}
          <div className="floating-controls">
            {/* Botão Scroll to Top - apenas na página de leitura */}
            {isReading && (
              <button
                className="control-button"
                onClick={scrollToTop}
                aria-label="Voltar ao topo"
                title="Voltar ao topo"
              >
                <ArrowUp size={20} />
              </button>
            )}

            <ThemeToggle />
            <FontSizeControl />
          </div>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
