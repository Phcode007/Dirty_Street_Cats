import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Heart, Book } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`footer ${isDark ? "dark" : "light"}`}>
      <div className="footer-content">
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <Book size={32} />
          </div>
          <h3 className="footer-title">Dirty Street Cats</h3>
          <p className="footer-subtitle">Uma história de Eldor</p>
          <p className="footer-description">
            Onde as sombras guardam segredos e os marginalizados são os
            verdadeiros heróis.
          </p>
        </div>

        <div className="footer-section">
          <h4>Navegação</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => handleNavigate("/")}>Início</button>
            </li>
            <li>
              <button onClick={() => handleNavigate("/chapters")}>
                Capítulos
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate("/world")}>
                Sobre Eldor
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate("/author")}>
                Sobre o Autor
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Sobre o Projeto</h4>
          <p className="footer-text">
            Uma plataforma de publicação de histórias de fantasia, criada para
            compartilhar narrativas épicas e imersivas com o mundo.
          </p>
          <p className="footer-text" style={{ marginTop: "15px" }}>
            Novos capítulos publicados regularmente.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} Dirty Street Cats. Feito com{" "}
          <Heart size={14} className="footer-heart" /> para os amantes de
          fantasia.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
