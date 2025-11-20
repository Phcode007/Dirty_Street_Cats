import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={`homepage ${isDark ? "dark" : "light"}`}>
      <div className="homepage-content">
        <h1 className="homepage-title">Dirty Street Cats</h1>

        <p className="homepage-subtitle">Uma história de Eldor</p>

        <button
          className="homepage-button"
          onClick={() => navigate("/chapters")}
        >
          Começar a Ler
        </button>

        <div className="homepage-decorative-line" />
      </div>
    </div>
  );
};

export default HomePage;
