import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import "./Header.css";

const Header = ({ onMenuToggle, isMenuOpen }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <header className={`header ${isDark ? "dark" : "light"}`}>
      <div className="header-logo" onClick={() => navigate("/")}>
        DSC
      </div>

      <button className="header-menu-button" onClick={onMenuToggle}>
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </header>
  );
};

export default Header;
